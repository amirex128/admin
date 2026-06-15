<?php

namespace App\Services\Sms;

use App\Services\Sms\Contracts\SmsProvider;
use App\Support\Facades\Sms;

/**
 * Central entry point for every outgoing SMS in the application.
 *
 * Resolve it through the {@see Sms} facade so call sites
 * never depend on a concrete gateway. Add reusable, intent-revealing helpers
 * here (e.g. {@see sendWelcome()}) instead of scattering pattern ids around the
 * codebase.
 */
class SmsManager
{
    /**
     * @param  array<string, int|string|null>  $patterns
     */
    public function __construct(
        private readonly SmsProvider $provider,
        private readonly array $patterns = [],
    ) {}

    /**
     * Send a raw pattern (template) message.
     *
     * @param  array<int, string>  $tokens
     */
    public function sendPattern(int|string $patternId, array $tokens, string $mobile): SmsResult
    {
        return $this->provider->sendPattern($patternId, $tokens, $mobile);
    }

    /**
     * Send a pattern message resolved from its configured name.
     *
     * @param  array<int, string>  $tokens
     */
    public function sendNamedPattern(string $name, array $tokens, string $mobile): SmsResult
    {
        $patternId = $this->patterns[$name] ?? null;

        if ($patternId === null) {
            return SmsResult::failure("SMS pattern [{$name}] is not configured.");
        }

        return $this->sendPattern($patternId, $tokens, $mobile);
    }

    /**
     * Ask the provider to generate and deliver a one-time verification code.
     */
    public function sendOtp(string $mobile, ?string $footer = null): SmsResult
    {
        return $this->provider->sendOtp($mobile, $footer);
    }

    /**
     * Verify a one-time code previously delivered through {@see sendOtp()}.
     */
    public function verifyOtp(string $mobile, string $code): bool
    {
        return $this->provider->verifyOtp($mobile, $code);
    }

    /**
     * Send the welcome message to a freshly registered user.
     */
    public function sendWelcome(string $mobile, string $name): SmsResult
    {
        return $this->sendNamedPattern('welcome', [$name], $mobile);
    }
}
