<?php

namespace App\Enums;

/**
 * The unit a product is sold by.
 */
enum SalesUnit: string
{
    case Piece = 'piece';
    case Meter = 'meter';
    case Gram = 'gram';
    case Kilogram = 'kilogram';
    case Liter = 'liter';
    case Package = 'package';

    /**
     * The localized human readable label for the unit.
     */
    public function label(): string
    {
        return match ($this) {
            self::Piece => 'عدد',
            self::Meter => 'متر',
            self::Gram => 'گرم',
            self::Kilogram => 'کیلوگرم',
            self::Liter => 'لیتر',
            self::Package => 'بسته',
        };
    }

    /**
     * Resolve a unit from a raw, possibly localized, value.
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
