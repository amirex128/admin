<?php

use App\Http\Controllers\Admin\AiModelController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserWalletController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Users management
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::post('users/{user}/wallet', [UserWalletController::class, 'store'])->name('users.wallet.store');

        // Subscription plans management
        Route::get('plans', [PlanController::class, 'index'])->name('plans.index');
        Route::post('plans', [PlanController::class, 'store'])->name('plans.store');
        Route::put('plans/{plan}', [PlanController::class, 'update'])->name('plans.update');
        Route::patch('plans/{plan}/toggle', [PlanController::class, 'toggle'])->name('plans.toggle');
        Route::delete('plans/{plan}', [PlanController::class, 'destroy'])->name('plans.destroy');

        // Products oversight (filter by owner name / id)
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
        Route::patch('products/{product}/toggle', [ProductController::class, 'toggle'])->name('products.toggle');
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

        // AI settings — manage available AI models, providers and pricing
        Route::get('settings/ai', [AiModelController::class, 'index'])->name('ai-models.index');
        Route::post('settings/ai', [AiModelController::class, 'store'])->name('ai-models.store');
        Route::put('settings/ai/{aiModel}', [AiModelController::class, 'update'])->name('ai-models.update');
        Route::patch('settings/ai/{aiModel}/toggle', [AiModelController::class, 'toggle'])->name('ai-models.toggle');
        Route::delete('settings/ai/{aiModel}', [AiModelController::class, 'destroy'])->name('ai-models.destroy');
    });
