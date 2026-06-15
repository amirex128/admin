<?php

namespace App\Enums;

/**
 * The lifecycle state of a customer order, displayed to sellers and admins as
 * a step-by-step wizard.
 */
enum OrderStatus: string
{
    case Proforma = 'proforma';
    case AwaitingConfirmation = 'awaiting_confirmation';
    case Preparing = 'preparing';
    case Shipping = 'shipping';
    case Delivered = 'delivered';
    case ReturnRequested = 'return_requested';
    case Returning = 'returning';
    case Returned = 'returned';
    case Closed = 'closed';

    /**
     * The localized human readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Proforma => 'پیش‌فاکتور',
            self::AwaitingConfirmation => 'در انتظار تأیید',
            self::Preparing => 'در حال آماده‌سازی',
            self::Shipping => 'در حال ارسال',
            self::Delivered => 'تحویل شده',
            self::ReturnRequested => 'درخواست مرجوعی',
            self::Returning => 'مرجوعی',
            self::Returned => 'مرجوع شده',
            self::Closed => 'بسته شده',
        };
    }

    /**
     * A semantic color used for status badges on the frontend.
     */
    public function color(): string
    {
        return match ($this) {
            self::Proforma => 'gray',
            self::AwaitingConfirmation => 'amber',
            self::Preparing => 'blue',
            self::Shipping => 'indigo',
            self::Delivered => 'green',
            self::ReturnRequested => 'orange',
            self::Returning => 'orange',
            self::Returned => 'red',
            self::Closed => 'slate',
        };
    }

    /**
     * The ordered list of statuses that make up the primary fulfilment flow
     * displayed in the wizard/stepper.
     *
     * @return array<int, self>
     */
    public static function flow(): array
    {
        return [
            self::Proforma,
            self::AwaitingConfirmation,
            self::Preparing,
            self::Shipping,
            self::Delivered,
            self::Closed,
        ];
    }

    /**
     * The statuses that belong to the return/refund branch of an order.
     *
     * @return array<int, self>
     */
    public static function returnFlow(): array
    {
        return [
            self::ReturnRequested,
            self::Returning,
            self::Returned,
        ];
    }

    /**
     * Whether this status is part of the return/refund branch.
     */
    public function isReturn(): bool
    {
        return in_array($this, self::returnFlow(), true);
    }

    /**
     * @return array<int, array{value: string, label: string, color: string}>
     */
    public static function options(): array
    {
        return array_map(
            static fn (self $case): array => [
                'value' => $case->value,
                'label' => $case->label(),
                'color' => $case->color(),
            ],
            self::cases(),
        );
    }
}
