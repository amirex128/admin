<?php

namespace App\Support\Facades;

use App\Services\Sms\SmsManager;
use App\Services\Sms\SmsResult;
use Illuminate\Support\Facades\Facade;

/**
 * @method static SmsResult sendPattern(int|string $patternId, array<int, string> $tokens, string $mobile)
 * @method static SmsResult sendNamedPattern(string $name, array<int, string> $tokens, string $mobile)
 * @method static SmsResult sendOtp(string $mobile, ?string $footer = null)
 * @method static bool verifyOtp(string $mobile, string $code)
 * @method static SmsResult sendWelcome(string $mobile, string $name)
 *
 * @see SmsManager
 */
class Sms extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'sms';
    }
}
