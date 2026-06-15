<?php

namespace App\Enums;

/**
 * Whether the amount due for an order has been settled.
 */
enum OrderPaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Paid = 'paid';

    /**
     * The localized human readable label for the payment status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'پرداخت‌نشده',
            self::Paid => 'پرداخت شده',
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
