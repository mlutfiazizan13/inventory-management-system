<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    public function inventory() {
        return $this->hasOne(StockItem::class, "product_id", "id");
    }
}
