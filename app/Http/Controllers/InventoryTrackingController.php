<?php

namespace App\Http\Controllers;

use App\Models\StockAdjustment;
use App\Models\StockItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryTrackingController extends Controller
{
    public function index() {
        $inventories = StockItem::where('status', 'active')->with('Product')->get();
        $stock_adjustments = StockAdjustment::whereRelation('Product', 'status', 'active')
            ->with('Product', 'AdjustedBy')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('inventory-tracking/index', ['inventories' => Inertia::always($inventories), 'stock_adjustments' => Inertia::always($stock_adjustments)]);
    }
}
