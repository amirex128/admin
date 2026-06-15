<?php

namespace App\Enums;

/**
 * Describes the business reason behind a wallet transaction.
 *
 * Every monetary movement recorded through the WalletService must be
 * attributed to one of these reasons so the ledger stays auditable.
 */
enum WalletTransactionReason: string
{
    case Charge = 'charge';
    case AdminAdjustment = 'admin_adjustment';
    case SubscriptionPurchase = 'subscription_purchase';
    case Refund = 'refund';

    /**
     * The localized human readable label for the reason.
     */
    public function label(): string
    {
        return match ($this) {
            self::Charge => 'شارژ کیف پول',
            self::AdminAdjustment => 'تعدیل توسط مدیر',
            self::SubscriptionPurchase => 'خرید اشتراک',
            self::Refund => 'بازگشت وجه',
        };
    }
}
