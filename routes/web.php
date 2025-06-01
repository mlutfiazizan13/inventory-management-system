<?php

use App\Http\Controllers\ProductController;
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
        Route::get('', [UserController::class,'index'])->name('users.index');
    });

        Route::prefix('products')->group(function () {
        Route::get('', [ProductController::class,'index'])->name('products.index');
        Route::post('/store', [ProductController::class, 'store'])->name('products.store');
        Route::patch('/update/{id}', [ProductController::class,'update'])->name('products.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
