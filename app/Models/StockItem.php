<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockItem extends Model
{
    
    public function Product() {
        return $this->hasOne(Product::class, "id", "product_id");
    }
}
