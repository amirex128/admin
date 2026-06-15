<?php

namespace App\Services\Sms;

/**
 * Immutable result returned by every SMS provider call.
 */
class SmsResult
{
    public function __construct(
        public bool $success,
        public ?string $message = null,
    ) {}

    public static function success(?string $message = null): self
    {
        return new self(true, $message);
    }

    public static function failure(?string $message = null): self
    {
        return new self(false, $message);
    }
}
