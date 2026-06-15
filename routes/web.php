<?php

use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\CouponController;
use App\Http\Controllers\User\CustomerController;
use App\Http\Controllers\User\CustomerImportController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\User\PackagingTypeController;
use App\Http\Controllers\User\PaymentCallbackController;
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

    // Payment gateway callback (ZarinPal returns the user here after payment).
    Route::get('financial/payment/callback', PaymentCallbackController::class)->name('payment.callback');

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

    // Order management — static segments before the {order} routes.
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{order}/pdf', [OrderController::class, 'pdf'])->name('orders.pdf');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::patch('orders/{order}/payment', [OrderController::class, 'updatePayment'])->name('orders.payment');

    // Customer relationship management (CRM) — static segments before {customer}.
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::post('customers/import/preview', [CustomerImportController::class, 'preview'])->name('customers.import.preview');
    Route::post('customers/import/run', [CustomerImportController::class, 'import'])->name('customers.import.run');
    Route::get('customers/import/template', [CustomerImportController::class, 'template'])->name('customers.import.template');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::patch('customers/{customer}/block', [CustomerController::class, 'toggleBlock'])->name('customers.block');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Discount coupons (Jalali validity window + product targeting)
    Route::get('coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::post('coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::put('coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
    Route::patch('coupons/{coupon}/toggle', [CouponController::class, 'toggle'])->name('coupons.toggle');
    Route::delete('coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');

    // Notifications (in-app feed + header bell)
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Categories & packaging types (managed inline from the product form)
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::post('packaging-types', [PackagingTypeController::class, 'store'])->name('packaging-types.store');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
