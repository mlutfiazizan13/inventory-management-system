<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockItemController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('users')->group(function () {
        Route::get('', [UserController::class, 'index'])->name('users.index');
        Route::post('/store', [UserController::class, 'store'])->name('users.store');
        Route::put('/update/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/delete/{id}', [UserController::class, 'delete'])->name('users.delete');
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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
