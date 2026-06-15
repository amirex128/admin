<?php

namespace App\Http\Controllers\User;

use App\Enums\WalletTransactionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\ChargeWalletRequest;
use App\Http\Resources\WalletTransactionResource;
use App\Services\Payment\GatewayException;
use App\Services\Payment\PaymentService;
use App\Services\Wallet\WalletService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class WalletController extends Controller
{
    public function __construct(
        private readonly WalletService $walletService,
        private readonly PaymentService $paymentService,
    ) {}

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
     * Start a wallet top-up by initiating a payment and redirecting the user to
     * the gateway. The wallet is credited later, on the verified callback.
     */
    public function charge(ChargeWalletRequest $request): SymfonyResponse
    {
        try {
            $initiation = $this->paymentService->initiate(
                user: $request->user(),
                amount: (int) $request->validated('amount'),
                callbackUrl: route('payment.callback'),
            );
        } catch (GatewayException $exception) {
            return back()->withErrors(['amount' => $exception->getMessage()]);
        }

        // Send the user to the gateway with a full-page (external) redirect.
        return Inertia::location($initiation->redirectUrl);
    }
}
