<?php

namespace Tests\Feature\Payment;

use App\Enums\PaymentStatus;
use App\Enums\WalletTransactionReason;
use App\Models\Payment;
use App\Models\User;
use App\Services\Payment\Contracts\PaymentGateway;
use App\Services\Wallet\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\FakePaymentGateway;
use Tests\TestCase;

class WalletPaymentTest extends TestCase
{
    use RefreshDatabase;

    private FakePaymentGateway $gateway;

    protected function setUp(): void
    {
        parent::setUp();

        $this->gateway = new FakePaymentGateway;
        $this->app->instance(PaymentGateway::class, $this->gateway);
    }

    public function test_charging_creates_a_pending_payment_and_redirects_to_the_gateway(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('wallet.charge'), ['amount' => 50000]);

        $response->assertRedirect("https://pay.test/{$this->gateway->authority}");

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 50000,
            'status' => PaymentStatus::Pending->value,
            'authority' => $this->gateway->authority,
        ]);
        $this->assertSame(0, app(WalletService::class)->balance($user));
    }

    public function test_successful_callback_verifies_and_credits_the_wallet(): void
    {
        $user = User::factory()->create();
        $payment = Payment::factory()->for($user)->create([
            'amount' => 50000,
            'authority' => $this->gateway->authority,
            'status' => PaymentStatus::Pending,
        ]);

        $this->actingAs($user)
            ->get(route('payment.callback', ['Authority' => $this->gateway->authority, 'Status' => 'OK']))
            ->assertRedirect(route('wallet.index'));

        $payment->refresh();
        $this->assertSame(PaymentStatus::Paid, $payment->status);
        $this->assertSame('123456789', $payment->ref_id);
        $this->assertNotNull($payment->wallet_transaction_id);
        $this->assertSame(50000, app(WalletService::class)->balance($user));
    }

    public function test_cancelled_callback_marks_the_payment_failed_without_crediting(): void
    {
        $user = User::factory()->create();
        $payment = Payment::factory()->for($user)->create([
            'amount' => 50000,
            'authority' => $this->gateway->authority,
            'status' => PaymentStatus::Pending,
        ]);

        $this->actingAs($user)
            ->get(route('payment.callback', ['Authority' => $this->gateway->authority, 'Status' => 'NOK']))
            ->assertRedirect(route('wallet.index'));

        $this->assertSame(PaymentStatus::Failed, $payment->refresh()->status);
        $this->assertSame(0, app(WalletService::class)->balance($user));
    }

    public function test_failed_verification_does_not_credit_the_wallet(): void
    {
        $this->gateway->verified = false;
        $user = User::factory()->create();
        Payment::factory()->for($user)->create([
            'amount' => 50000,
            'authority' => $this->gateway->authority,
            'status' => PaymentStatus::Pending,
        ]);

        $this->actingAs($user)
            ->get(route('payment.callback', ['Authority' => $this->gateway->authority, 'Status' => 'OK']))
            ->assertRedirect(route('wallet.index'));

        $this->assertSame(0, app(WalletService::class)->balance($user));
    }

    public function test_callback_is_idempotent_for_already_paid_payments(): void
    {
        $user = User::factory()->create();
        $payment = Payment::factory()->for($user)->paid()->create([
            'amount' => 50000,
            'authority' => $this->gateway->authority,
        ]);

        $this->actingAs($user)
            ->get(route('payment.callback', ['Authority' => $this->gateway->authority, 'Status' => 'OK']));

        $this->assertSame(PaymentStatus::Paid, $payment->refresh()->status);
        $this->assertSame(0, app(WalletService::class)->balance($user));
        $this->assertSame(0, $user->walletTransactions()->where('reason', WalletTransactionReason::Charge->value)->count());
    }
}
