<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\PasswordResetCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetController extends Controller
{
    use PasswordValidationRules;

    public function __construct(
        private readonly PasswordResetCodeService $resetCodes,
    ) {}

    /**
     * Show the "forgot password" page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Deliver a reset code over SMS (and email, when available).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'regex:/^09[0-9]{9}$/'],
        ]);

        $user = User::query()->where('phone', $validated['phone'])->first();

        if ($user !== null) {
            $this->resetCodes->send($user);
        }

        // Respond identically whether or not the account exists to avoid user enumeration.
        return back()->with('status', __('If an account matches that number, a reset code has been sent.'));
    }

    /**
     * Verify the code and reset the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'regex:/^09[0-9]{9}$/'],
            'code' => ['required', 'string'],
            'password' => $this->passwordRules(),
        ]);

        $user = User::query()->where('phone', $validated['phone'])->first();

        if ($user === null || ! $this->resetCodes->verify($user, $validated['code'])) {
            throw ValidationException::withMessages([
                'code' => __('The provided code is invalid or has expired.'),
            ]);
        }

        $user->forceFill([
            'password' => $validated['password'],
            'phone_verified_at' => $user->phone_verified_at ?? now(),
        ])->save();

        $this->resetCodes->clear($user);

        return to_route('login')->with('status', __('Your password has been reset.'));
    }
}
