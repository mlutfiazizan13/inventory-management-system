<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $purchase_orders = PurchaseOrder::with('Supplier')->where('status', 'active')->get();
        $suppliers = Supplier::where('status', 'active')->get();
        $products = Product::where('status', 'active')->get();

        return Inertia::render("purchase_orders/index", [
            "purchase_orders" => Inertia::always($purchase_orders),
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

        $purchase_order = new PurchaseOrder();
        $purchase_order->id = Str::uuid();
        $purchase_order->supplier_id = $request->supplier_id;

        $purchase_order->order_date = $request->order_date;
        $purchase_order->expected_date = $request->expected_date;
        $purchase_order->supplier_id = $request->supplier_id;
        $purchase_order->total_cost = $request->total_cost;
        $purchase_order->save();

        foreach ($request->purchase_order_items as $item) {
            $po_item = new PurchaseOrderItem();
            $po_item->id = Str::uuid();
            $po_item->purchase_order_id = $purchase_order->id;
            $po_item->product_id = $item['product_id'];
            $po_item->quantity = $item['quantity'];
            $po_item->unit_price = $item['unit_price'];
            $po_item->save();
        }

        DB::commit();
        return redirect()->back()->with('success', 'Purchase Order created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required",
            "contact_name" => "nullable",
            "email" => "nullable|email",
            "phone" => "required",
            "address" => "nullable",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $supplier = Supplier::find($id);

        if ($supplier == null) {
            return redirect()->back()->with("error", "Supplier not found");
        }

        $supplier->name = $request->name;
        $supplier->contact_name = $request->contact_name;
        $supplier->email = $request->email;
        $supplier->phone = $request->phone;
        $supplier->address = $request->address;
        $supplier->save();

        return redirect()->back()->with('success', 'Supplier updated successfully.');
    }

    public function delete(int $id)
    {
        $supplier = Supplier::find($id);
        if ($supplier == null) {
            return redirect()->back()->with('error', 'Supplier not found');
        }

        $supplier->status = 'inactive';
        $supplier->save();

        return redirect()->back()->with('success', 'Supplier deleted successfully');
    }
}
