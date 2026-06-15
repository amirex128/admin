<?php

namespace Tests\Feature\Sms;

use App\Support\Facades\Sms;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SmsManagerTest extends TestCase
{
    public function test_it_sends_a_pattern_message_with_replace_tokens()
    {
        Http::fake(['*' => Http::response(['Success' => true, 'Message' => 'ok'])]);

        $result = Sms::sendPattern(12, ['تست'], '09120000000');

        $this->assertTrue($result->success);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'sendpatternmessage')
                && $request['OtpId'] === 12
                && $request['ReplaceToken'] === ['تست']
                && $request['MobileNumber'] === '09120000000'
                && $request->hasHeader('ApiKey', 'test-key');
        });
    }

    public function test_it_sends_a_named_pattern_resolved_from_config()
    {
        Http::fake(['*' => Http::response(['Success' => true])]);

        $result = Sms::sendWelcome('09120000000', 'علی');

        $this->assertTrue($result->success);

        Http::assertSent(fn ($request) => str_contains($request->url(), 'sendpatternmessage')
            && $request['OtpId'] === '1001'
            && $request['ReplaceToken'] === ['علی'],
        );
    }

    public function test_it_requests_and_verifies_otp_codes()
    {
        Http::fake(['*' => Http::response(['Success' => true])]);

        $this->assertTrue(Sms::sendOtp('09120000000')->success);
        $this->assertTrue(Sms::verifyOtp('09120000000', '12345'));

        Http::assertSent(fn ($request) => str_contains($request->url(), 'sendcode'));
        Http::assertSent(fn ($request) => str_contains($request->url(), 'checkcode')
            && $request['Code'] === '12345',
        );
    }

    public function test_a_failed_gateway_response_is_reported_as_a_failure()
    {
        Http::fake(['*' => Http::response(['Success' => false, 'Message' => 'bad'])]);

        $result = Sms::sendPattern(12, [], '09120000000');

        $this->assertFalse($result->success);
        $this->assertSame('bad', $result->message);
    }
}
