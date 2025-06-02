<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockItemController extends Controller
{
    public function index() {
        $stocks = StockItem::where('status', 'active')->get();
        $products = Product::where('status', 'active')->get();

        return Inertia::render('stock-items/index', ['stock_items' => $stocks, 'products' => $products]);
    }

}
