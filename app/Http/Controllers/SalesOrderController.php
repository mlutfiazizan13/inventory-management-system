<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Customer;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\StockItem;
use App\Services\StockAdjustmentService;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SalesOrderController extends Controller
{

    private StockAdjustmentService $stockMovementService;

    public function __construct(StockAdjustmentService $stockMovementService)
    {
        $this->stockMovementService = $stockMovementService;
    }

    public function index()
    {
        $sales_orders = SalesOrder::with('Customer', 'SalesOrderItems')->where('status', 'active')->get();
        $customers = Customer::where('status', 'active')->get();
        $products = Product::with('inventory')->where('status', 'active')->get();

        return Inertia::render("sales_orders/index", [
            "sales_orders" => $sales_orders,
            "customers" => $customers,
            "products" => $products
        ]);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "customer_id" => "required",
            "order_date" => "required",
            "notes" => "nullable",
            "total_amount" => "required",
            "sales_order_items" => "array",
            "sales_order_items.*.product_id" => "required",
            "sales_order_items.*.quantity" => "required",
            "sales_order_items.*.price" => "required"
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();

        $sales_order_id = Str::uuid();
        $sales_order = new SalesOrder();
        $sales_order->id = $sales_order_id;
        $sales_order->customer_id = $request->customer_id;
        $sales_order->order_date = $request->order_date;
        $sales_order->sales_status = "draft";
        $sales_order->payment_status = "unpaid";
        $sales_order->created_by = auth()->id();
        $sales_order->total_amount = $request->total_amount;
        $sales_order->save();

        foreach ($request->sales_order_items as $item) {
            $so_item = new SalesOrderItem();
            $so_item->id = Str::uuid();
            $so_item->sales_order_id = $sales_order_id;
            $so_item->product_id = $item['product_id'];
            $so_item->quantity = $item['quantity'];
            $so_item->price = $item['price'];
            $so_item->subtotal = $item['price'] * $item['quantity'];
            $so_item->save();
        }

        DB::commit();
        return redirect()->back()->with('success', 'Sales Order created successfully.');
    }


    public function update(Request $request, string $id)
    {

        $validator = Validator::make($request->all(), [
            "customer_id" => "required",
            "order_date" => "required",
            "notes" => "nullable",
            "total_amount" => "required",
            "sales_order_items" => "array",
            "sales_order_items.*.product_id" => "required",
            "sales_order_items.*.quantity" => "required",
            "sales_order_items.*.price" => "required"
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $sales_order = SalesOrder::find($id);

        if ($sales_order == null) {
            return redirect()->back()->with("error", "Sales Order  not found");
        }

        DB::beginTransaction();

        $sales_order->customer_id = $request->customer_id;
        $sales_order->order_date = $request->order_date;
        $sales_order->sales_status = "draft";
        $sales_order->payment_status = "unpaid";
        $sales_order->created_by = auth()->id();
        $sales_order->total_amount = $request->total_amount;
        $sales_order->save();


        //DELETE ALL SALES ORDER ITEMS
        $sales_order_items = SalesOrderItem::where('sales_order_id', $id)->delete();

        // CREATE NEW PURCHASE ORDER ITEMS
        foreach ($request->sales_order_items as $item) {
            $so_item = new SalesOrderItem();
            $so_item->id = Str::uuid();
            $so_item->sales_order_id = $id;
            $so_item->product_id = $item['product_id'];
            $so_item->quantity = $item['quantity'];
            $so_item->price = $item['price'];
            $so_item->subtotal = $item['price'] * $item['quantity'];
            $so_item->save();
        }

        DB::commit();
        return redirect()->back()->with('success', 'Sales Order updated successfully.');
    }


    public function delete(string $id)
    {
        $sales_order = SalesOrder::find($id);
        if ($sales_order == null) {
            return redirect()->back()->with('error', 'Sales Order not found');
        }

        DB::beginTransaction();
        $sales_order->status = 'inactive';
        $sales_order->save();

        $sales_order_items = SalesOrderItem::where('sales_order_id', $id)->get();
        foreach ($sales_order_items as $item) {
            $item->status = 'inactive';
        }
        $sales_order_items->save();
        DB::commit();
        return redirect()->back()->with('success', 'Sales Order deleted successfully');
    }


    public function updateStatus(string $id)
    {
        $sales_order = SalesOrder::find($id);

        if ($sales_order == null) {
            return redirect()->back()->with('error', 'Sales Order not found');
        }

        // Define workflow in order
        $workflow_status = ['draft', 'pending', 'confirmed', 'fulfilled', 'Paid'];
        $current_status = $sales_order->sales_status;

        // Ensure current status is valid
        $current_index = array_search($current_status, $workflow_status);

        if ($current_index === false) {
            return redirect()->back()->with('error', 'Invalid current status: "' . $current_status . '"');
        }

        // Check if already at final step
        if ($current_index === count($workflow_status) - 1) {
            return redirect()->back()->with('info', 'Sales Order is already at the final status: "' . $current_status . '"');
        }

        // Determine next status
        $next_status = $workflow_status[$current_index + 1];

        // Custom business logic from "pending" → "confirmed"
        if ($current_status === 'pending' && $next_status === 'confirmed') {
            $sales_order_items = SalesOrderItem::where('sales_order_id', $id)->get();

            foreach ($sales_order_items as $item) {
                $stock_item = StockItem::where('product_id', $item->product_id)->first();

                $this->stockMovementService->decrease(
                    $stock_item->product_id,
                    $item->quantity
                );
            }


            Log::info("Processing special logic for pending → confirmed for SalesOrder ID: {$sales_order->id}");
        }

        // Update the status
        $sales_order->sales_status = $next_status;
        $sales_order->save();

        return redirect()->back()->with('success', 'Sales Order status updated to "' . $next_status . '"');
    }
}
