<?php

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
    Route::get('/pages/{slug}', [StorefrontController::class, 'page'])->name('page');
    Route::get('/categories/{category}', [StorefrontController::class, 'category'])->name('category');
    Route::get('/orders/{code}', [StorefrontController::class, 'order'])->name('order');
    Route::get('/products/{product}', [StorefrontController::class, 'product'])->name('product');
});
