<?php

namespace App\Services\Payment\Data;

/**
 * The result of asking the gateway to start a payment.
 */
class PaymentInitiation
{
    public function __construct(
        public readonly string $authority,
        public readonly string $redirectUrl,
    ) {}
}
