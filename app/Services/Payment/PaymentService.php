<?php

namespace App\Services\Payment;

use App\Enums\PaymentStatus;
use App\Enums\WalletTransactionReason;
use App\Models\Payment;
use App\Models\User;
use App\Services\Payment\Contracts\PaymentGateway;
use App\Services\Payment\Data\PaymentInitiation;
use App\Services\Wallet\WalletService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Coordinates wallet top-ups through the payment gateway: it records a Payment,
 * starts the gateway flow, verifies the callback and credits the wallet, and
 * lets administrators reverse or refund settled payments.
 */
class PaymentService
{
    public function __construct(
        private readonly PaymentGateway $gateway,
        private readonly WalletService $walletService,
    ) {}

    /**
     * Create a pending payment and start the gateway flow.
     */
    public function initiate(User $user, int $amount, string $callbackUrl): PaymentInitiation
    {
        $payment = $user->payments()->create([
            'amount' => $amount,
            'status' => PaymentStatus::Pending,
            'description' => 'شارژ کیف پول',
        ]);

        try {
            $initiation = $this->gateway->request(
                amount: $amount,
                description: $payment->description,
                callbackUrl: $callbackUrl,
                mobile: $user->phone,
                email: $user->email,
            );
        } catch (GatewayException $exception) {
            $payment->update(['status' => PaymentStatus::Failed]);

            throw $exception;
        }

        $payment->update(['authority' => $initiation->authority]);

        return $initiation;
    }

    /**
     * Handle the gateway callback: verify the payment and credit the wallet.
     */
    public function handleCallback(string $authority, string $status): Payment
    {
        $payment = Payment::query()->where('authority', $authority)->firstOrFail();

        // Already processed — return as-is so the callback stays idempotent.
        if ($payment->status !== PaymentStatus::Pending) {
            return $payment;
        }

        if (strtoupper($status) !== 'OK') {
            $payment->update(['status' => PaymentStatus::Failed]);

            return $payment;
        }

        $verification = $this->gateway->verify($payment->amount, $authority);

        if (! $verification->verified) {
            $payment->update([
                'status' => PaymentStatus::Failed,
                'meta' => ['verify_code' => $verification->code, 'message' => $verification->message],
            ]);

            return $payment;
        }

        return DB::transaction(function () use ($payment, $verification): Payment {
            $transaction = $this->walletService->deposit(
                user: $payment->user,
                amount: $payment->amount,
                reason: WalletTransactionReason::Charge,
                description: 'شارژ کیف پول (زرین‌پال)',
                reference: $payment,
                meta: ['ref_id' => $verification->refId],
            );

            $payment->update([
                'status' => PaymentStatus::Paid,
                'ref_id' => $verification->refId,
                'card_pan' => $verification->cardPan,
                'fee' => $verification->fee,
                'paid_at' => now(),
                'wallet_transaction_id' => $transaction->id,
            ]);

            return $payment;
        });
    }

    /**
     * Reverse a payment within the settlement window and debit the wallet.
     *
     * @throws GatewayException
     * @throws RuntimeException
     */
    public function reverse(Payment $payment, User $admin): void
    {
        if (! $payment->isReversible()) {
            throw new RuntimeException('این تراکنش قابل ریورس نیست.');
        }

        if (! $this->gateway->reverse($payment->authority)) {
            throw new GatewayException('ریورس تراکنش توسط درگاه انجام نشد.');
        }

        DB::transaction(function () use ($payment, $admin): void {
            $this->walletService->withdraw(
                user: $payment->user,
                amount: $payment->amount,
                reason: WalletTransactionReason::PaymentReversal,
                description: 'برگشت وجه شارژ کیف پول (ریورس)',
                performedBy: $admin,
                reference: $payment,
            );

            $payment->update(['status' => PaymentStatus::Reversed]);
        });
    }

    /**
     * Refund a settled payment and debit the wallet.
     *
     * @throws GatewayException
     * @throws RuntimeException
     */
    public function refund(Payment $payment, User $admin): void
    {
        if (! $payment->isRefundable()) {
            throw new RuntimeException('این تراکنش قابل استرداد نیست.');
        }

        if (! $this->gateway->refund($payment->authority, $payment->amount, 'استرداد شارژ کیف پول')) {
            throw new GatewayException('استرداد وجه توسط درگاه انجام نشد.');
        }

        DB::transaction(function () use ($payment, $admin): void {
            $this->walletService->withdraw(
                user: $payment->user,
                amount: $payment->amount,
                reason: WalletTransactionReason::Refund,
                description: 'استرداد وجه شارژ کیف پول',
                performedBy: $admin,
                reference: $payment,
            );

            $payment->update(['status' => PaymentStatus::Refunded]);
        });
    }

    /**
     * The list of paid-but-unverified transactions reported by the gateway.
     *
     * @return array<int, array{authority: string, amount: int, callback_url: string, date: string}>
     */
    public function unverified(): array
    {
        return $this->gateway->unverified();
    }

    /**
     * Inquire about a payment's current status at the gateway.
     *
     * @return array{code: int, status: string, message: string}
     */
    public function inquiry(Payment $payment): array
    {
        return $this->gateway->inquiry((string) $payment->authority);
    }
}
