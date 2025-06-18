<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesOrder extends Model
{
    protected $keyType = 'string';
    protected $guarded = [];

    public function Customer()
    {
        return $this->hasOne(Customer::class, 'id', 'customer_id');
    }

    public function SalesOrderItems() {
        return $this->hasMany(SalesOrderItem::class, 'sales_order_id', 'id');
    }
}
