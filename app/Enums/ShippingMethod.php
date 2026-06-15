<?php

namespace App\Enums;

/**
 * The delivery method selected for an order.
 */
enum ShippingMethod: string
{
    case Post = 'post';
    case Tipax = 'tipax';
    case Courier = 'courier';
    case InPerson = 'in_person';

    /**
     * The localized human readable label for the shipping method.
     */
    public function label(): string
    {
        return match ($this) {
            self::Post => 'پست',
            self::Tipax => 'تیپاکس',
            self::Courier => 'پیک',
            self::InPerson => 'تحویل حضوری',
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
