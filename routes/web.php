<?php

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
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
