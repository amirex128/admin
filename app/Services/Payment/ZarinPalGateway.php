<?php

namespace App\Services\Payment;

use App\Services\Payment\Contracts\PaymentGateway;
use App\Services\Payment\Data\PaymentInitiation;
use App\Services\Payment\Data\PaymentVerification;
use Http\Client\Common\Plugin\HeaderDefaultsPlugin;
use Throwable;
use ZarinPal\Sdk\ClientBuilder;
use ZarinPal\Sdk\Endpoint\GraphQL\RequestTypes\RefundRequest;
use ZarinPal\Sdk\Endpoint\PaymentGateway\RequestTypes\InquiryRequest;
use ZarinPal\Sdk\Endpoint\PaymentGateway\RequestTypes\RequestRequest;
use ZarinPal\Sdk\Endpoint\PaymentGateway\RequestTypes\ReverseRequest;
use ZarinPal\Sdk\Endpoint\PaymentGateway\RequestTypes\UnverifiedRequest;
use ZarinPal\Sdk\Endpoint\PaymentGateway\RequestTypes\VerifyRequest;
use ZarinPal\Sdk\Options;
use ZarinPal\Sdk\ZarinPal;

/**
 * ZarinPal implementation of the payment gateway, built on the official SDK.
 *
 * Amounts are handled in Toman (currency IRT) to match the wallet ledger.
 */
class ZarinPalGateway implements PaymentGateway
{
    /**
     * The successful verify response codes (100 = verified, 101 = already verified).
     *
     * @var array<int, int>
     */
    private const VERIFIED_CODES = [100, 101];

    private ZarinPal $sdk;

    public function __construct(string $merchantId, string $accessToken = '', bool $sandbox = false)
    {
        $clientBuilder = new ClientBuilder;
        $clientBuilder->addPlugin(new HeaderDefaultsPlugin(['Accept' => 'application/json']));

        $this->sdk = new ZarinPal(new Options([
            'client_builder' => $clientBuilder,
            'merchant_id' => $merchantId,
            'access_token' => $accessToken,
            'sandbox' => $sandbox,
        ]));
    }

    public function request(
        int $amount,
        string $description,
        string $callbackUrl,
        ?string $mobile = null,
        ?string $email = null,
    ): PaymentInitiation {
        try {
            $request = new RequestRequest([
                'amount' => $amount,
                'description' => $description,
                'callback_url' => $callbackUrl,
                'currency' => 'IRT',
                'mobile' => $mobile,
                'email' => $email,
            ]);

            $gateway = $this->sdk->paymentGateway();
            $response = $gateway->request($request);

            if ($response->code !== 100 || $response->authority === '') {
                throw new GatewayException("درخواست پرداخت ناموفق بود (کد {$response->code}).");
            }

            return new PaymentInitiation(
                authority: $response->authority,
                redirectUrl: $gateway->getRedirectUrl($response->authority),
            );
        } catch (GatewayException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new GatewayException('خطا در ارتباط با درگاه پرداخت.', 0, $exception);
        }
    }

    public function verify(int $amount, string $authority): PaymentVerification
    {
        try {
            $response = $this->sdk->paymentGateway()->verify(new VerifyRequest([
                'amount' => $amount,
                'authority' => $authority,
            ]));

            return new PaymentVerification(
                verified: in_array($response->code, self::VERIFIED_CODES, true),
                code: $response->code,
                refId: $response->ref_id ?? null,
                cardPan: $response->card_pan ?? null,
                fee: isset($response->fee) ? (int) $response->fee : null,
                message: $response->message ?? null,
            );
        } catch (Throwable $exception) {
            throw new GatewayException('خطا در تأیید پرداخت.', 0, $exception);
        }
    }

    public function reverse(string $authority): bool
    {
        try {
            $response = $this->sdk->paymentGateway()->reverse(new ReverseRequest([
                'authority' => $authority,
            ]));

            return $response->code === 100;
        } catch (Throwable $exception) {
            throw new GatewayException('خطا در ریورس تراکنش.', 0, $exception);
        }
    }

    public function refund(string $sessionId, int $amount, string $description): bool
    {
        try {
            $this->sdk->refundService()->refund(new RefundRequest([
                'sessionId' => $sessionId,
                'amount' => $amount,
                'description' => $description,
                'method' => RefundRequest::METHOD_PAYA,
                'reason' => RefundRequest::REASON_CUSTOMER_REQUEST,
            ]));

            return true;
        } catch (Throwable $exception) {
            throw new GatewayException('خطا در استرداد وجه.', 0, $exception);
        }
    }

    public function unverified(): array
    {
        try {
            $response = $this->sdk->paymentGateway()->unverified(new UnverifiedRequest);

            return $response->authorities;
        } catch (Throwable $exception) {
            throw new GatewayException('خطا در دریافت تراکنش‌های تأیید نشده.', 0, $exception);
        }
    }

    /**
     * Inquire about the status of a transaction by its authority.
     *
     * @return array{code: int, status: string, message: string}
     */
    public function inquiry(string $authority): array
    {
        try {
            $response = $this->sdk->paymentGateway()->inquiry(new InquiryRequest([
                'authority' => $authority,
            ]));

            return [
                'code' => $response->code,
                'status' => $response->status,
                'message' => $response->message,
            ];
        } catch (Throwable $exception) {
            throw new GatewayException('خطا در استعلام تراکنش.', 0, $exception);
        }
    }
}
