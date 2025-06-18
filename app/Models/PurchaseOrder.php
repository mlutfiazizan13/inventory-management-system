<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $keyType = 'string';
    protected $guarded = [];

    public function Supplier() {
        return $this->hasOne(Supplier::class, 'id', 'supplier_id');
    }

    public function PurchaseOrderItems() {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id', 'id');
    }
}
