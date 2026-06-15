<?php

namespace App\Enums;

/**
 * Describes how a product may be ordered by customers.
 */
enum OrderMode: string
{
    case Direct = 'direct';
    case PreInvoice = 'pre_invoice';

    /**
     * The localized human readable label for the order mode.
     */
    public function label(): string
    {
        return match ($this) {
            self::Direct => 'ثبت سفارش مستقیم',
            self::PreInvoice => 'فقط صدور پیش‌فاکتور',
        };
    }

    /**
     * Resolve an order mode from a raw, possibly localized, value.
     */
    public static function fromLabel(?string $value): ?self
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $value = trim($value);

        foreach (self::cases() as $case) {
            if ($case->value === $value || $case->label() === $value) {
                return $case;
            }
        }

        return null;
    }

    /**
     * A list of `value`/`label` pairs for use in select inputs.
     *
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
