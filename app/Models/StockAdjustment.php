<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockAdjustment extends Model
{
    protected $guarded = [];
    public function Product()
    {
        return $this->hasOne(Product::class, "id", "product_id");
    }

    public function AdjustedBy()
    {
        return $this->hasOne(User::class, "id", "adjusted_by");
    }
}
