<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\SalesOrder;
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


        $salesByMonth = SalesOrder::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('SUM(total_amount) as total')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $summary = [
            'totalSales' => SalesOrder::sum('total_amount'),
            'totalOrders' => SalesOrder::count(),
            'monthlyAverage' => SalesOrder::avg('total_amount'),
            'totalCustomers' => Customer::count(),
        ];


        $sales = SalesOrder::select([
            DB::raw("DATE_FORMAT(order_date, '%M') as month"),
            DB::raw('SUM(total_amount) as total'),
            DB::raw('MONTH(order_date) as month_number'),
        ])
            ->where('status', 'active') // Adjust condition if needed
            ->groupBy('month', 'month_number')
            ->orderBy('month_number')
            ->get();

        $topProducts = DB::select('select p.name as product_name, SUM(quantity) as total_sold from sales_orders so 
            left join sales_order_items soi on sales_order_id = so.id
            left join products p on p.id = soi.product_id
            group by product_name 
            order by total_sold desc');


        $salesByCustomer = DB::select('select s.name as customer_name, SUM(so.total_amount) as total from sales_orders so 
            left join customers s on s.id = so.customer_id
            group by customer_name 
            order by total desc');


        // dd($topProducts);



        return Inertia::render('dashboard', [
            'totalProducts' => $totalProducts,
            'lowStock' => $lowStock,
            'inventoryValue' => $inventoryValue,
            'totalSuppliers' => $totalSuppliers,
            'purchasesBySupplier' => $purchasesBySupplier,
            'statusCounts' => $statusCounts,
            'purchases' => $purchases,
            'stockProducts' => $stockProducts,
            'latestPurchaseOrders' => $latestPurchaseOrders,
            'salesSummary' => $summary,
            'salesByMonth' => $salesByMonth,
            'sales' => $sales,
            'topProducts' => $topProducts,
            'salesByCustomer' => $salesByCustomer,
        ]);
    }
}
