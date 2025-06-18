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
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->bigInteger('customer_id');
            $table->date('order_date');
            $table->string('sales_status');
            $table->string('payment_status');
            $table->decimal('total_amount', 20, 2); 
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('sales_orders');
    }
};
