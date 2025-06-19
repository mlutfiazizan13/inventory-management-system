<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\StockItem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Gather your data just like previously...
        $totalProducts = Product::where('status', 'active')->count();

        // dd(Product::with('inventory')->get());

        $lowStock = Product::with('inventory')
            ->where('status', 'active')
            ->get()
            ->filter(function ($item) {
                return $item->inventory && $item->inventory->quantity <= 10;
            })
            ->values();


        $inventoryValue = StockItem::with('product')->where('status', 'active')->get()
            ->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });

        $totalSuppliers = Supplier::count();

        $purchasesBySupplier = PurchaseOrder::select('supplier_id', DB::raw('SUM(total_cost) as total'))
            ->where('status', 'active')
            ->with('supplier')->groupBy('supplier_id')->get();

        $statusCounts = PurchaseOrder::select('purchase_order_status', DB::raw('COUNT(id) as total'))
            ->where('status', 'active')
            ->groupBy('purchase_order_status')
            ->get()
            ->map(function ($item) {
                $item->purchase_order_status = Str::ucfirst($item->purchase_order_status);
                return $item;
            });

        $purchases = PurchaseOrder::select([
            DB::raw("DATE_FORMAT(order_date, '%M') as month"),
            DB::raw('SUM(total_cost) as total'),
            DB::raw('MONTH(order_date) as month_number'), // Add numeric month for sorting
        ])
            ->where('purchase_order_status', '!=', 'draft')
            ->where('status', 'active')
            ->groupBy('month', 'month_number') // Group by both if needed
            ->orderBy('month_number')
            ->get();

        $stockProducts = Product::with('inventory')->where('status', 'active')->get();

        $latestPurchaseOrders = PurchaseOrder::with('Supplier')->where('purchase_order_status', '!=', 'received')->where('status', 'active')->orderBy('created_at')->limit(5)->get();

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
