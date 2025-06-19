<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StockItem;
use App\Services\StockAdjustmentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PurchaseOrderController extends Controller
{

    private StockAdjustmentService $stockMovementService;
    
    public function __construct(StockAdjustmentService $stockMovementService) {
        $this->stockMovementService = $stockMovementService;
    }

    public function index()
    {
        $purchase_orders = PurchaseOrder::with('Supplier', 'PurchaseOrderItems')->where('status', 'active')->get();
        $suppliers = Supplier::where('status', 'active')->get();
        $products = Product::where('status', 'active')->get();
        return Inertia::render("purchase_orders/index", [
            "purchase_orders" => $purchase_orders,
            "suppliers" => $suppliers,
            "products" => $products
        ]);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "supplier_id" => "required",
            "order_date" => "required",
            "expected_date" => "required",
            "purchase_order_items" => "array",
            "purchase_order_items.*.product_id" => "required",
            "purchase_order_items.*.quantity" => "required",
            "purchase_order_items.*.unit_price" => "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();

        $purchase_order_id = Str::uuid();
        $purchase_order = new PurchaseOrder();
        $purchase_order->id = $purchase_order_id;
        $purchase_order->supplier_id = $request->supplier_id;
        $purchase_order->order_date = $request->order_date;
        $purchase_order->expected_date = $request->expected_date;
        $purchase_order->supplier_id = $request->supplier_id;
        $purchase_order->total_cost = $request->total_cost;
        $purchase_order->created_by = auth()->id();
        $purchase_order->save();

        foreach ($request->purchase_order_items as $item) {
            $po_item = new PurchaseOrderItem();
            $po_item->id = Str::uuid();
            $po_item->purchase_order_id = $purchase_order_id;
            $po_item->product_id = $item['product_id'];
            $po_item->quantity = $item['quantity'];
            $po_item->unit_price = $item['unit_price'];
            $po_item->save();
        }

        DB::commit();
        return redirect()->back()->with('success', 'Purchase Order created successfully.');
    }


    public function update(Request $request, string $id)
    {

        $validator = Validator::make($request->all(), [
            "supplier_id" => "required",
            "order_date" => "required",
            "expected_date" => "required",
            "purchase_order_items" => "array",
            "purchase_order_items.*.product_id" => "required",
            "purchase_order_items.*.quantity" => "required",
            "purchase_order_items.*.unit_price" => "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $purchase_order = PurchaseOrder::find($id);

        if ($purchase_order == null) {
            return redirect()->back()->with("error", "Purchase Order  not found");
        }

        DB::beginTransaction();

        $purchase_order->supplier_id = $request->supplier_id;
        $purchase_order->order_date = $request->order_date;
        $purchase_order->expected_date = $request->expected_date;
        $purchase_order->supplier_id = $request->supplier_id;
        $purchase_order->total_cost = $request->total_cost;
        $purchase_order->save();


        //DELETE ALL PURCHASE ORDER ITEMS
        $purchase_order_items = PurchaseOrderItem::where('purchase_order_id', $id)->delete();

        // CREATE NEW PURCHASE ORDER ITEMS
        foreach ($request->purchase_order_items as $item) {
            $po_item = new PurchaseOrderItem();
            $po_item->id = Str::uuid();
            $po_item->purchase_order_id = $id;
            $po_item->product_id = $item['product_id'];
            $po_item->quantity = $item['quantity'];
            $po_item->unit_price = $item['unit_price'];
            $po_item->save();
        }

        DB::commit();
        return redirect()->back()->with('success', 'Purchase Order updated successfully.');
    }

    public function delete(string $id)
    {
        $purchase_order = PurchaseOrder::find($id);
        if ($purchase_order == null) {
            return redirect()->back()->with('error', 'Purchase Order not found');
        }

        DB::beginTransaction();
        $purchase_order->status = 'inactive';
        $purchase_order->save();

        PurchaseOrderItem::where('purchase_order_id', $id)->update(['status' => 'inactive']);
        DB::commit();
        return redirect()->back()->with('success', 'Purchase Order deleted successfully');
    }


    public function updateStatus(string $id)
    {
        $purchase_order = PurchaseOrder::find($id);

        if ($purchase_order == null) {
            return redirect()->back()->with('error', 'Purchase Order not found');
        }

        // Define workflow in order
        $workflow_status = ['draft', 'ordered', 'received'];
        $current_status = $purchase_order->purchase_order_status;

        // Ensure current status is valid
        $current_index = array_search($current_status, $workflow_status);

        if ($current_index === false) {
            return redirect()->back()->with('error', 'Invalid current status: "' . $current_status . '"');
        }

        // Check if already at final step
        if ($current_index === count($workflow_status) - 1) {
            return redirect()->back()->with('info', 'Purchase Order is already at the final status: "' . $current_status . '"');
        }

        // Determine next status
        $next_status = $workflow_status[$current_index + 1];

        // Custom business logic from "ordered" → "received"
        if ($current_status === 'ordered' && $next_status === 'received') {
            $purchase_order_items = PurchaseOrderItem::where('purchase_order_id', $id)->get();

            foreach ($purchase_order_items as $item) {
                $stock_item = StockItem::where('product_id', $item->product_id)->first();

                $this->stockMovementService->increase(
                    $stock_item->product_id,
                    $item->quantity
                );
            }


            Log::info("Processing special logic for ordered → received for PurchaseOrder ID: {$purchase_order->id}");
        }

        // Update the status
        $purchase_order->purchase_order_status = $next_status;
        $purchase_order->save();

        return redirect()->back()->with('success', 'Purchase Order status updated to "' . $next_status . '"');
    }
}
