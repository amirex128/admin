<?php

namespace App\Services\Sms\Contracts;

use App\Services\Sms\SmsResult;

/**
 * Contract every SMS gateway implementation must fulfil so the application can
 * swap providers without touching call sites.
 */
interface SmsProvider
{
    /**
     * Send a pattern (template) message, replacing the template tokens in order.
     *
     * @param  array<int, string>  $tokens
     */
    public function sendPattern(int|string $patternId, array $tokens, string $mobile): SmsResult;

    /**
     * Ask the provider to generate and deliver a one-time verification code.
     */
    public function sendOtp(string $mobile, ?string $footer = null): SmsResult;

    /**
     * Verify a one-time code previously sent through {@see sendOtp()}.
     */
    public function verifyOtp(string $mobile, string $code): bool;
}
