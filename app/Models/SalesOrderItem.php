<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesOrderItem extends Model
{
    protected $keyType = 'string';
    protected $guarded = [];


    public function Product() {
        return $this->hasOne(Product::class, 'id','product_id');
    }
}
