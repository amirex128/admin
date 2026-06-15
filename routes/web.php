<?php

use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\PackagingTypeController;
use App\Http\Controllers\User\ProductAiController;
use App\Http\Controllers\User\ProductController;
use App\Http\Controllers\User\ProductImportController;
use App\Http\Controllers\User\ProductMediaController;
use App\Http\Controllers\User\SubscriptionPlanController;
use App\Http\Controllers\User\WalletController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Financial section (wallet & subscription plans)
    Route::get('financial/wallet', [WalletController::class, 'index'])->name('wallet.index');
    Route::post('financial/wallet/charge', [WalletController::class, 'charge'])->name('wallet.charge');
    Route::get('financial/plans', [SubscriptionPlanController::class, 'index'])->name('plans.index');
    Route::post('financial/plans/{plan}/subscribe', [SubscriptionPlanController::class, 'subscribe'])->name('plans.subscribe');

    // Product management — static segments are registered before the
    // {product} routes so they take precedence during matching.
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');

    Route::post('products/import/preview', [ProductImportController::class, 'preview'])->name('products.import.preview');
    Route::post('products/import/run', [ProductImportController::class, 'import'])->name('products.import.run');
    Route::get('products/import/template', [ProductImportController::class, 'template'])->name('products.import.template');

    Route::post('products/editor-image', [ProductMediaController::class, 'storeEditorImage'])->name('products.editor-image');
    Route::post('products/ai-description', [ProductAiController::class, 'generateDescription'])->name('products.ai-description');

    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::patch('products/{product}/toggle', [ProductController::class, 'toggle'])->name('products.toggle');

    Route::delete('media/{media}', [ProductMediaController::class, 'destroy'])->name('media.destroy');

    // Categories & packaging types (managed inline from the product form)
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::post('packaging-types', [PackagingTypeController::class, 'store'])->name('packaging-types.store');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
