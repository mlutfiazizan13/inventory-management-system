<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        $brands = Brand::select("id","name")->get();
        $categories = Category::select("id","name")->get();
        return Inertia::render("products/index", ["products" => $products, "categories"=> $categories, "brands" => $brands]);
    }

    public function show(Product $product)
    {
        return Inertia::render("", ["product" => $product]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name"=> "required",
            "unit"=> "required",
            "category_id"=> "required",
            "brand_id"=> "required",
            "currency"=> "required",
            "price"=> "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

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

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            "name"=> "required",
            "unit"=> "required",
            "category_id"=> "required",
            "brand_id"=> "required",
            "currency"=> "required",
            "price"=> "required",
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $product = Product::find($id);

        if ($product == null) {
            return redirect()->back()->with("error","Product not found");
        }

        $product->name = $request->name;
        $product->sku = $this->generateSKU($request->category_id, $request->brand_id, $request->name);
        $product->unit = $request->unit;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->currency = $request->currency;
        $product->price = $request->price;
        $product->save();

        return redirect()->back()->with('success', 'Product updated successfully.');
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
