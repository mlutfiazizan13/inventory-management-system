<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\StockItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StockItemController extends Controller
{
    public function index() {
        $stocks = StockItem::where('status', 'active')->with('Product')->get();
        $products = Product::where('status', 'active')->whereNotIn('id', $stocks->pluck('product_id'))->get();
        return Inertia::render('stock-items/index', ['stock_items' => Inertia::always($stocks), 'products' => $products]);
    }

     public function show(StockItem $stock_item)
    {
        return Inertia::render("", ["stock_item" => $stock_item]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "product_id"=> "required|unique:stock_items,product_id",
            "quantity"=> "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $stock_item = new StockItem();
        $stock_item->product_id = $request->product_id;
        $stock_item->quantity = $request->quantity;
        $stock_item->save();

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            "product_id"=> "required",
            "quantity"=> "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $stock_item = StockItem::find($id);

        if ($stock_item == null) {
            return redirect()->back()->with("error","Stock Item not found");
        }

        $stock_item->product_id = $request->product_id;
        $stock_item->quantity = $request->quantity;
        $stock_item->save();

        return redirect()->back()->with('success', 'Stock Item updated successfully.');
    }

    public function delete(int $id) {
        $stock_item = StockItem::find($id);
        if ($stock_item == null) {
            return redirect()->back()->with('error','StockItem not found');
        }

        $stock_item->status = 'inactive';
        $stock_item->save();

        return redirect()->back()->with('success','StockItem deleted successfully');
    }

}
