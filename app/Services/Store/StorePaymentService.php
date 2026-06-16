<?php

namespace App\Services\Store;

use App\Enums\OrderPaymentStatus;
use App\Models\Order;
use App\Models\StoreSetting;
use App\Services\Payment\ZarinPalGateway;

/**
 * Processes storefront order payments through each seller's own ZarinPal
 * gateway (configured in their store settings) — distinct from the platform
 * wallet top-up gateway read from env/config.
 */
class StorePaymentService
{
    /**
     * Whether the store can accept online ZarinPal payments.
     */
    public function canUseZarinpal(StoreSetting $settings): bool
    {
        return $settings->zarinpal_enabled
            && ! empty($settings->zarinpal_merchant_id)
            && ! empty($settings->zarinpal_access_token);
    }

    /**
     * Build a ZarinPal gateway from the store's own credentials.
     */
    public function gatewayFor(StoreSetting $settings): ZarinPalGateway
    {
        return new ZarinPalGateway(
            merchantId: (string) $settings->zarinpal_merchant_id,
            accessToken: (string) $settings->zarinpal_access_token,
            sandbox: (bool) config('services.zarinpal.sandbox', false),
        );
    }

    /**
     * Start a payment for the order and return the gateway redirect URL.
     */
    public function initiate(StoreSetting $settings, Order $order, string $callbackUrl): string
    {
        $initiation = $this->gatewayFor($settings)->request(
            amount: $order->total,
            description: "پرداخت سفارش {$order->code}",
            callbackUrl: $callbackUrl,
            mobile: $order->customer_phone,
        );

        $order->update(['payment_authority' => $initiation->authority]);

        return $initiation->redirectUrl;
    }

    /**
     * Verify a returning payment and mark the order paid on success.
     */
    public function verify(StoreSetting $settings, Order $order, string $authority, string $status): bool
    {
        if (strtoupper($status) !== 'OK') {
            return false;
        }

        if ($order->payment_status === OrderPaymentStatus::Paid) {
            return true;
        }

        $verification = $this->gatewayFor($settings)->verify($order->total, $authority);

        if (! $verification->verified) {
            return false;
        }

        $order->update([
            'payment_status' => OrderPaymentStatus::Paid,
            'paid_at' => now(),
        ]);

        return true;
    }
}
