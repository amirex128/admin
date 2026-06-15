<?php

namespace App\Services\Payment\Data;

/**
 * The result of verifying a payment with the gateway.
 */
class PaymentVerification
{
    public function __construct(
        public readonly bool $verified,
        public readonly int $code,
        public readonly ?string $refId = null,
        public readonly ?string $cardPan = null,
        public readonly ?int $fee = null,
        public readonly ?string $message = null,
    ) {}
}
