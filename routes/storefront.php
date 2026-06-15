<?php

use App\Http\Controllers\Storefront\AccountController;
use App\Http\Controllers\Storefront\AuthController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

/*
| Public storefront routes. A store is resolved by its subdomain or custom
| domain via the {store} segment. In production a host-based group can forward
| to these same routes; the path-based form (/shop/{store}) works everywhere
| and is convenient for previews and local development.
*/
Route::prefix('shop/{store}')->name('storefront.')->group(function () {
    Route::get('/', [StorefrontController::class, 'home'])->name('home');
    Route::get('/faq', [StorefrontController::class, 'faq'])->name('faq');
    Route::get('/cart', [StorefrontController::class, 'cart'])->name('cart');
    Route::get('/checkout', [StorefrontController::class, 'checkout'])->name('checkout');
    Route::post('/checkout', [StorefrontController::class, 'placeOrder'])->name('checkout.place');
    Route::get('/payment/callback', [StorefrontController::class, 'paymentCallback'])->name('payment.callback');
    Route::get('/track', [StorefrontController::class, 'track'])->name('track');
    Route::post('/track', [StorefrontController::class, 'trackLookup'])->name('track.lookup');

    // Customer accounts (per-store `customer` guard).
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/account', [AccountController::class, 'orders'])->name('account');
    Route::get('/account/profile', [AccountController::class, 'profile'])->name('account.profile');
    Route::put('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile.update');
    Route::put('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::get('/account/orders/{code}', [AccountController::class, 'order'])->name('account.order');
    Route::get('/pages/{slug}', [StorefrontController::class, 'page'])->name('page');
    Route::get('/categories/{category}', [StorefrontController::class, 'category'])->name('category');
    Route::get('/orders/{code}', [StorefrontController::class, 'order'])->name('order');
    Route::get('/products/{product}', [StorefrontController::class, 'product'])->name('product');
});
