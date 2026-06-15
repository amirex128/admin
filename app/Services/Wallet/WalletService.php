<?php

namespace App\Services\Wallet;

use App\Enums\WalletTransactionReason;
use App\Enums\WalletTransactionType;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Central service for every monetary movement in the application.
 *
 * IMPORTANT: All balance reads and mutations across the whole project MUST go
 * through this service. Never update `wallets.balance` or insert
 * `wallet_transactions` rows directly elsewhere. This guarantees a single,
 * auditable, race-safe ledger.
 */
class WalletService
{
    /**
     * Get the user's wallet, creating an empty one on first access.
     */
    public function wallet(User $user): Wallet
    {
        return $user->wallet()->firstOrCreate([], ['balance' => 0]);
    }

    /**
     * The current balance for the user, in Toman.
     */
    public function balance(User $user): int
    {
        return $this->wallet($user)->balance;
    }

    /**
     * Credit (increase) the user's wallet.
     *
     * @param  array<string, mixed>  $meta
     */
    public function deposit(
        User $user,
        int $amount,
        WalletTransactionReason $reason,
        ?string $description = null,
        ?User $performedBy = null,
        ?Model $reference = null,
        array $meta = [],
    ): WalletTransaction {
        $this->assertPositiveAmount($amount);

        return $this->record($user, WalletTransactionType::Credit, $amount, $reason, $description, $performedBy, $reference, $meta);
    }

    /**
     * Debit (decrease) the user's wallet, failing if funds are insufficient.
     *
     * @param  array<string, mixed>  $meta
     *
     * @throws InsufficientBalanceException
     */
    public function withdraw(
        User $user,
        int $amount,
        WalletTransactionReason $reason,
        ?string $description = null,
        ?User $performedBy = null,
        ?Model $reference = null,
        array $meta = [],
    ): WalletTransaction {
        $this->assertPositiveAmount($amount);

        return $this->record($user, WalletTransactionType::Debit, $amount, $reason, $description, $performedBy, $reference, $meta);
    }

    /**
     * Apply an administrative adjustment. A positive amount credits the wallet,
     * a negative amount debits it.
     *
     * @param  array<string, mixed>  $meta
     *
     * @throws InsufficientBalanceException
     */
    public function adjust(
        User $user,
        int $amount,
        User $admin,
        ?string $description = null,
        array $meta = [],
    ): WalletTransaction {
        if ($amount === 0) {
            throw new InvalidArgumentException('Adjustment amount cannot be zero.');
        }

        $reason = WalletTransactionReason::AdminAdjustment;

        return $amount > 0
            ? $this->deposit($user, $amount, $reason, $description, $admin, null, $meta)
            : $this->withdraw($user, abs($amount), $reason, $description, $admin, null, $meta);
    }

    /**
     * Persist a balance change and its ledger entry atomically.
     *
     * @param  array<string, mixed>  $meta
     */
    protected function record(
        User $user,
        WalletTransactionType $type,
        int $amount,
        WalletTransactionReason $reason,
        ?string $description,
        ?User $performedBy,
        ?Model $reference,
        array $meta,
    ): WalletTransaction {
        return DB::transaction(function () use ($user, $type, $amount, $reason, $description, $performedBy, $reference, $meta) {
            /** @var Wallet $wallet */
            $wallet = $user->wallet()->lockForUpdate()->firstOrCreate([], ['balance' => 0]);

            $newBalance = $wallet->balance + ($type->sign() * $amount);

            if ($newBalance < 0) {
                throw new InsufficientBalanceException;
            }

            $wallet->update(['balance' => $newBalance]);

            $transaction = new WalletTransaction([
                'user_id' => $user->id,
                'type' => $type,
                'reason' => $reason,
                'amount' => $amount,
                'balance_after' => $newBalance,
                'description' => $description,
                'performed_by' => $performedBy?->id,
                'meta' => $meta === [] ? null : $meta,
            ]);

            if ($reference !== null) {
                $transaction->reference()->associate($reference);
            }

            $wallet->transactions()->save($transaction);

            return $transaction;
        });
    }

    /**
     * @throws InvalidArgumentException
     */
    protected function assertPositiveAmount(int $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('Amount must be a positive integer.');
        }
    }
}
