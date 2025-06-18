<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('supplier_id');
            $table->decimal('total_cost', 20, 2); // DECIMAL with precision
            $table->dateTime('order_date')->nullable(); // DATETIME
            $table->dateTime('expected_date')->nullable(); // DATETIME
            $table->dateTime('received_at')->nullable(); // DATETIME
            $table->text('notes')->nullable();
            $table->string('purchase_order_status')->default('draft');
            $table->bigInteger('created_by');
            $table->string('status')->default('active');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};