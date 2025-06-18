<?php

namespace App\Services;

use App\Models\StockAdjustment;
use App\Models\StockItem;
use Illuminate\Support\Facades\DB;

class StockAdjustmentService
{
    public function increase(int $productId, int $quantity, string $reason = 'restock', ?int $userId = null): void
    {
        $this->recordAdjustment($productId, 'in', $quantity, $reason, $userId);
        $this->updateInventory($productId, $quantity);
    }

    public function decrease(int $productId, int $quantity, string $reason = 'sale', ?int $userId = null): void
    {
        $this->recordAdjustment($productId, 'out', $quantity, $reason, $userId);
        $this->updateInventory($productId, -$quantity);
    }

    public function adjust(int $productId, int $quantity, string $reason = 'manual adjustment', ?int $userId = null): void
    {
        $type = $quantity > 0 ? 'in' : 'out';
        $this->recordAdjustment($productId, 'adjustment', abs($quantity), $reason, $userId);
        $this->updateInventory($productId, $quantity);
    }

    protected function recordAdjustment(int $productId, string $type, int $quantity, string $reason, ?int $userId): void
    {
        StockAdjustment::create([
            'product_id'   => $productId,
            'adjustment_type'=> $type,
            'quantity'     => $quantity,
            'reason'       => $reason,
            'adjusted_by'      => $userId ?? auth()->id(),
        ]);
    }

    protected function updateInventory(int $productId, int $quantity): void
    {
        DB::transaction(function () use ($productId, $quantity) {
            $inventory = StockItem::firstOrCreate(
                ['product_id' => $productId],
                ['quantity' => 0]
            );

            $inventory->quantity += $quantity;
            $inventory->quantity = max(0, $inventory->quantity); // prevent negative
            $inventory->save();
        });
    }
}
