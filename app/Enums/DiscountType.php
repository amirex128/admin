<?php

namespace App\Enums;

/**
 * How a coupon's value is applied to an order: a percentage of the subtotal or
 * a fixed Toman amount.
 */
enum DiscountType: string
{
    case Percentage = 'percentage';
    case Fixed = 'fixed';

    /**
     * The localized human readable label for the type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Percentage => 'درصدی',
            self::Fixed => 'مبلغ ثابت',
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
