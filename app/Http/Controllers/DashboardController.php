<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\StockItem;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Gather your data just like previously...
        $totalProducts = Product::count();

        // dd(Product::with('inventory')->get());

        $lowStock = Product::with('inventory')->get()
            // ->filter(function ($item) {
            //     return $item->inventory->quantity;
            // })
            ->values();

        $inventoryValue = StockItem::with('product')->get()
            ->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });

        $totalSuppliers = Supplier::count();

        $purchasesBySupplier = PurchaseOrder::select('supplier_id', DB::raw('SUM(total_cost) as total'))
            ->with('supplier')->groupBy('supplier_id')->get();

        $statusCounts = PurchaseOrder::select('purchase_order_status', DB::raw('COUNT(id) as total'))
            ->groupBy('purchase_order_status')->get();

        $purchases = PurchaseOrder::select(
            DB::raw('MONTH(order_date) as month'),
            DB::raw('SUM(total_cost) as total')
        )
            ->groupBy('month')->get();

        $stockProducts = Product::with('inventory')->get();

        return Inertia::render('dashboard', [
            'totalProducts' => $totalProducts,
            'lowStock' => $lowStock,
            'inventoryValue' => $inventoryValue,
            'totalSuppliers' => $totalSuppliers,
            'purchasesBySupplier' => $purchasesBySupplier,
            'statusCounts' => $statusCounts,
            'purchases' => $purchases,
            'stockProducts' => $stockProducts,
        ]);
    }
}
