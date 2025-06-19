<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\StockItemController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('users')->group(function () {
        Route::get('', [UserController::class, 'index'])->name('users.index');
        Route::post('/store', [UserController::class, 'store'])->name('users.store');
        Route::put('/update/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/delete/{id}', [UserController::class, 'delete'])->name('users.delete');
    });

    Route::prefix('roles')->group(function () {
        Route::get('', [RoleController::class, 'index'])->name('roles.index');
        Route::post('/store', [RoleController::class, 'store'])->name('roles.store');
        Route::put('/update/{id}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/delete/{id}', [RoleController::class, 'delete'])->name('roles.delete');
    });

    Route::prefix('products')->group(function () {
        Route::get('', [ProductController::class, 'index'])->name('products.index');
        Route::post('/store', [ProductController::class, 'store'])->name('products.store');
        Route::put('/update/{id}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/delete/{id}', [ProductController::class, 'delete'])->name('products.delete');
    });

    Route::prefix('stock-items')->group(function () {
        Route::get('', [StockItemController::class, 'index'])->name('stock-items.index');
        Route::post('/store', [StockItemController::class, 'store'])->name('stock-items.store');
        Route::put('/update/{id}', [StockItemController::class, 'update'])->name('stock-items.update');
        Route::delete('/delete/{id}', [StockItemController::class, 'delete'])->name('stock-items.delete');
    });

    Route::prefix('suppliers')->group(function () {
        Route::get('', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::post('/store', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::put('/update/{id}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::delete('/delete/{id}', [SupplierController::class, 'delete'])->name('suppliers.delete');
    });


    Route::prefix('purchase-orders')->group(function () {
        Route::get('', [PurchaseOrderController::class, 'index'])->name('purchase_orders.index');
        Route::post('/store', [PurchaseOrderController::class, 'store'])->name('purchase_orders.store');
        Route::put('/update/{id}', [PurchaseOrderController::class, 'update'])->name('purchase_orders.update');
        Route::delete('/delete/{id}', [PurchaseOrderController::class, 'delete'])->name('purchase_orders.delete');
        Route::put('/update-status/{id}', [PurchaseOrderController::class, 'updateStatus'])->name('purchase_orders.update_status');
    });

    Route::prefix('customers')->group(function () {
        Route::get('', [CustomerController::class, 'index'])->name('customers.index');
        Route::post('/store', [CustomerController::class, 'store'])->name('customers.store');
        Route::put('/update/{id}', [CustomerController::class, 'update'])->name('customers.update');
        Route::delete('/delete/{id}', [CustomerController::class, 'delete'])->name('customers.delete');
    });

    Route::prefix('sales-orders')->group(function () {
        Route::get('', [SalesOrderController::class, 'index'])->name('sales_orders.index');
        Route::post('/store', [SalesOrderController::class, 'store'])->name('sales_orders.store');
        Route::put('/update/{id}', [SalesOrderController::class, 'update'])->name('sales_orders.update');
        Route::delete('/delete/{id}', [SalesOrderController::class, 'delete'])->name('sales_orders.delete');
        Route::put('/update-status/{id}', [SalesOrderController::class, 'updateStatus'])->name('sales_orders.update_status');
    });

    Route::prefix('inventory-tracking')->group(function () {
        Route::get('', [InventoryTrackingController::class, 'index'])->name('inventory_tracking.index');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
