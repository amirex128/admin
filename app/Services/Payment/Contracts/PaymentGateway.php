<?php

namespace App\Services\Payment\Contracts;

use App\Services\Payment\Data\PaymentInitiation;
use App\Services\Payment\Data\PaymentVerification;
use App\Services\Payment\GatewayException;

/**
 * Abstraction over the payment provider so the application (and its tests) are
 * decoupled from the concrete ZarinPal SDK.
 */
interface PaymentGateway
{
    /**
     * Start a payment, returning the authority and the URL to redirect the user to.
     *
     * @throws GatewayException
     */
    public function request(
        int $amount,
        string $description,
        string $callbackUrl,
        ?string $mobile = null,
        ?string $email = null,
    ): PaymentInitiation;

    /**
     * Verify a returned payment by its authority.
     *
     * @throws GatewayException
     */
    public function verify(int $amount, string $authority): PaymentVerification;

    /**
     * Reverse a payment within the settlement window (under 30 minutes).
     *
     * @throws GatewayException
     */
    public function reverse(string $authority): bool;

    /**
     * Refund a settled payment.
     *
     * @throws GatewayException
     */
    public function refund(string $sessionId, int $amount, string $description): bool;

    /**
     * Fetch the list of paid-but-unverified transactions from the gateway.
     *
     * @return array<int, array{authority: string, amount: int, callback_url: string, date: string}>
     *
     * @throws GatewayException
     */
    public function unverified(): array;

    /**
     * Inquire about the current status of a transaction by its authority.
     *
     * @return array{code: int, status: string, message: string}
     *
     * @throws GatewayException
     */
    public function inquiry(string $authority): array;
}
