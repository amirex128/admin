<?php

namespace Tests\Support;

use App\Services\Payment\Contracts\PaymentGateway;
use App\Services\Payment\Data\PaymentInitiation;
use App\Services\Payment\Data\PaymentVerification;

/**
 * An in-memory payment gateway used to drive payment flows in tests without
 * touching the real ZarinPal API.
 */
class FakePaymentGateway implements PaymentGateway
{
    public string $authority = 'A00000000000000000000000000000000001';

    public bool $verified = true;

    public bool $reverseResult = true;

    public bool $refundResult = true;

    /** @var array<int, array{authority: string, amount: int, callback_url: string, date: string}> */
    public array $unverifiedList = [];

    /** @var array{code: int, status: string, message: string} */
    public array $inquiryResult = ['code' => 100, 'status' => 'VERIFIED', 'message' => 'ok'];

    public function request(int $amount, string $description, string $callbackUrl, ?string $mobile = null, ?string $email = null): PaymentInitiation
    {
        return new PaymentInitiation($this->authority, "https://pay.test/{$this->authority}");
    }

    public function verify(int $amount, string $authority): PaymentVerification
    {
        return new PaymentVerification(
            verified: $this->verified,
            code: $this->verified ? 100 : -51,
            refId: $this->verified ? '123456789' : null,
            cardPan: $this->verified ? '603799******1234' : null,
            fee: 0,
            message: $this->verified ? 'Paid' : 'Failed',
        );
    }

    public function reverse(string $authority): bool
    {
        return $this->reverseResult;
    }

    public function refund(string $sessionId, int $amount, string $description): bool
    {
        return $this->refundResult;
    }

    public function unverified(): array
    {
        return $this->unverifiedList;
    }

    public function inquiry(string $authority): array
    {
        return $this->inquiryResult;
    }
}
