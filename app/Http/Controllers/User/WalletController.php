<?php

namespace App\Http\Controllers\User;

use App\Enums\WalletTransactionReason;
use App\Enums\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\ChargeWalletRequest;
use App\Http\Resources\WalletTransactionResource;
use App\Services\Wallet\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(private readonly WalletService $walletService) {}

    /**
     * Display the wallet overview with balance and recent transactions.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $transactions = $user->walletTransactions()
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($transaction) => WalletTransactionResource::make($transaction)->resolve());

        return Inertia::render('financial/wallet', [
            'balance' => $this->walletService->balance($user),
            'transactions' => $transactions,
            'stats' => [
                'total_credited' => (int) $user->walletTransactions()
                    ->where('type', WalletTransactionType::Credit->value)->sum('amount'),
                'total_debited' => (int) $user->walletTransactions()
                    ->where('type', WalletTransactionType::Debit->value)->sum('amount'),
            ],
        ]);
    }

    /**
     * Charge (top up) the authenticated user's wallet.
     *
     * In production the amount would be confirmed by a payment gateway callback
     * before crediting; here we credit directly through the WalletService.
     */
    public function charge(ChargeWalletRequest $request): RedirectResponse
    {
        $this->walletService->deposit(
            user: $request->user(),
            amount: (int) $request->validated('amount'),
            reason: WalletTransactionReason::Charge,
            description: 'شارژ کیف پول',
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'کیف پول شما با موفقیت شارژ شد.']);

        return to_route('wallet.index');
    }
}
