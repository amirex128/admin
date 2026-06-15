<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustWalletRequest;
use App\Models\User;
use App\Services\Wallet\InsufficientBalanceException;
use App\Services\Wallet\WalletService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class UserWalletController extends Controller
{
    public function __construct(private readonly WalletService $walletService) {}

    /**
     * Apply an administrative balance adjustment to the user's wallet.
     */
    public function store(AdjustWalletRequest $request, User $user): RedirectResponse
    {
        try {
            $this->walletService->adjust(
                user: $user,
                amount: $request->signedAmount(),
                admin: $request->user(),
                description: $request->validated('description'),
            );
        } catch (InsufficientBalanceException $exception) {
            return back()->withErrors(['amount' => $exception->getMessage()]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'موجودی کیف پول کاربر بروزرسانی شد.']);

        return back();
    }
}
