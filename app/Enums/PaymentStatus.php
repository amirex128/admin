<?php

namespace App\Enums;

/**
 * The lifecycle state of a wallet top-up payment processed through the gateway.
 */
enum PaymentStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Failed = 'failed';
    case Reversed = 'reversed';
    case Refunded = 'refunded';

    /**
     * The localized human readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'در انتظار پرداخت',
            self::Paid => 'پرداخت شده',
            self::Failed => 'ناموفق',
            self::Reversed => 'برگشت داده شده (ریورس)',
            self::Refunded => 'مسترد شده',
        };
    }
}
