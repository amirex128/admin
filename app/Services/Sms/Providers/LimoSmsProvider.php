<?php

namespace App\Services\Sms\Providers;

use App\Services\Sms\Contracts\SmsProvider;
use App\Services\Sms\SmsResult;
use Illuminate\Http\Client\Factory as HttpClient;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * LimoSMS (api.limosms.com) gateway implementation.
 *
 * @see https://api.limosms.com
 */
class LimoSmsProvider implements SmsProvider
{
    /**
     * @param  array{api_key: ?string, base_url: string, timeout: int}  $config
     */
    public function __construct(
        private readonly HttpClient $http,
        private readonly array $config,
    ) {}

    public function sendPattern(int|string $patternId, array $tokens, string $mobile): SmsResult
    {
        return $this->post('sendpatternmessage', [
            'OtpId' => $patternId,
            'ReplaceToken' => array_values($tokens),
            'MobileNumber' => $mobile,
        ]);
    }

    public function sendOtp(string $mobile, ?string $footer = null): SmsResult
    {
        return $this->post('sendcode', array_filter([
            'Mobile' => $mobile,
            'Footer' => $footer,
        ], fn ($value): bool => $value !== null));
    }

    public function verifyOtp(string $mobile, string $code): bool
    {
        return $this->post('checkcode', [
            'Mobile' => $mobile,
            'Code' => $code,
        ])->success;
    }

    /**
     * Issue a POST request to the gateway and normalise the response.
     *
     * @param  array<string, mixed>  $payload
     */
    private function post(string $endpoint, array $payload): SmsResult
    {
        if (empty($this->config['api_key'])) {
            Log::warning('LimoSMS API key is not configured; skipping SMS dispatch.', [
                'endpoint' => $endpoint,
            ]);

            return SmsResult::failure('SMS gateway is not configured.');
        }

        try {
            $response = $this->http
                ->timeout($this->config['timeout'])
                ->withHeaders(['ApiKey' => $this->config['api_key']])
                ->acceptJson()
                ->asJson()
                ->post(rtrim($this->config['base_url'], '/').'/'.$endpoint, $payload);
        } catch (Throwable $exception) {
            Log::error('LimoSMS request failed.', [
                'endpoint' => $endpoint,
                'message' => $exception->getMessage(),
            ]);

            return SmsResult::failure('SMS gateway request failed.');
        }

        $body = $response->json();
        $success = $response->successful() && (bool) ($body['Success'] ?? false);

        if (! $success) {
            Log::warning('LimoSMS reported a failed dispatch.', [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $body,
            ]);
        }

        return new SmsResult($success, $body['Message'] ?? null);
    }
}
