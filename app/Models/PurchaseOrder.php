<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $guarded = [];

    public function Supplier() {
        return $this->hasOne(Supplier::class, 'id', 'supplier_id');
    }
}
