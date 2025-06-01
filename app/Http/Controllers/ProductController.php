<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render("products/index", ["products" => $products]);
    }

    public function show(Product $product)
    {
        return Inertia::render("", ["product" => $product]);
    }

    public function store(Request $request)
    {
        $product = new Product();
        $product->name = $request->name;
        $product->sku = $this->generateSKU($request->category_id, $request->brand_id, $request->name);
        $product->unit = $request->unit;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->currency = $request->currency;
        $product->price = $request->price;
        $product->save();

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(Product $product)
    {
        $product->update([
            "name" => $product->name,
            "price" => $product->price
        ]);
        return redirect()->route("")->with("success", "");
    }

    function generateSKU($category, $brand, $productName)
    {
        $catCode = strtoupper(substr($category, 0, 3));
        $brandCode = strtoupper(substr($brand, 0, 3));
        $prodCode = strtoupper(substr(preg_replace('/\s+/', '', $productName), 0, 5));
        $random = rand(100, 999);

        return "{$catCode}-{$brandCode}-{$prodCode}-{$random}";
    }
}
