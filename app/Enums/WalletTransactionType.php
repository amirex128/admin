<?php

namespace App\Enums;

/**
 * Represents the direction of a wallet transaction.
 *
 * Credit increases the wallet balance, Debit decreases it.
 */
enum WalletTransactionType: string
{
    case Credit = 'credit';
    case Debit = 'debit';

    /**
     * The localized human readable label for the type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Credit => 'واریز',
            self::Debit => 'برداشت',
        };
    }

    /**
     * The sign applied to the amount for this type (+1 or -1).
     */
    public function sign(): int
    {
        return $this === self::Credit ? 1 : -1;
    }
}
