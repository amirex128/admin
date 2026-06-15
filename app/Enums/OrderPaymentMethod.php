<?php

namespace App\Enums;

/**
 * How the customer pays (or is expected to pay) for an order.
 */
enum OrderPaymentMethod: string
{
    case Wallet = 'wallet';
    case Online = 'online';
    case CashOnDelivery = 'cash_on_delivery';
    case BankTransfer = 'bank_transfer';

    /**
     * The localized human readable label for the payment method.
     */
    public function label(): string
    {
        return match ($this) {
            self::Wallet => 'کیف پول',
            self::Online => 'پرداخت آنلاین',
            self::CashOnDelivery => 'پرداخت در محل',
            self::BankTransfer => 'کارت به کارت',
        };
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            static fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
