<?php

namespace App\Enums;

/**
 * The relationship state of a customer in the seller's CRM.
 */
enum CustomerStatus: string
{
    case Active = 'active';
    case Blocked = 'blocked';

    /**
     * The localized human readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Active => 'فعال',
            self::Blocked => 'مسدود',
        };
    }

    /**
     * A badge colour hint consumed by the frontend.
     */
    public function color(): string
    {
        return match ($this) {
            self::Active => 'emerald',
            self::Blocked => 'rose',
        };
    }

    /**
     * Resolve a status from a raw, possibly localized, value.
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
