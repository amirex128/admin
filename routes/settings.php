<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Settings\StoreSettingController;
use App\Http\Controllers\User\AiPreferenceController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    // AI settings — choose the model that powers the user's AI requests.
    Route::get('settings/ai', [AiPreferenceController::class, 'edit'])->name('settings.ai.edit');
    Route::put('settings/ai', [AiPreferenceController::class, 'update'])->name('settings.ai.update');

    // Store settings — payment, shipping, location and finance configuration.
    Route::get('settings/store', [StoreSettingController::class, 'edit'])->name('settings.store.edit');
    Route::put('settings/store', [StoreSettingController::class, 'update'])->name('settings.store.update');
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
