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

        $purchases = PurchaseOrder::select([
            DB::raw("DATE_FORMAT(order_date, '%M') as month"),
            DB::raw('SUM(total_cost) as total'),
            DB::raw('MONTH(order_date) as month_number'), // Add numeric month for sorting
        ])
            ->groupBy('month', 'month_number') // Group by both if needed
            ->orderBy('month_number')
            ->get();

        $stockProducts = Product::with('inventory')->get();

        $latestPurchaseOrders = PurchaseOrder::with('Supplier')->where('status', 'active')->orderBy('created_at')->limit(5)->get();

        return Inertia::render('dashboard', [
            'totalProducts' => $totalProducts,
            'lowStock' => $lowStock,
            'inventoryValue' => $inventoryValue,
            'totalSuppliers' => $totalSuppliers,
            'purchasesBySupplier' => $purchasesBySupplier,
            'statusCounts' => $statusCounts,
            'purchases' => $purchases,
            'stockProducts' => $stockProducts,
            'latestPurchaseOrders' => $latestPurchaseOrders
        ]);
    }
}
