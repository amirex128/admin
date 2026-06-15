<?php

namespace Tests\Feature\Admin;

use App\Enums\PaymentStatus;
use App\Enums\WalletTransactionReason;
use App\Models\Payment;
use App\Models\User;
use App\Services\Payment\Contracts\PaymentGateway;
use App\Services\Wallet\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\FakePaymentGateway;
use Tests\TestCase;

class AdminPaymentManagementTest extends TestCase
{
    use RefreshDatabase;

    private FakePaymentGateway $gateway;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->gateway = new FakePaymentGateway;
        $this->app->instance(PaymentGateway::class, $this->gateway);
    }

    private function fundedUser(int $balance = 50000): User
    {
        $user = User::factory()->create();
        app(WalletService::class)->deposit($user, $balance, WalletTransactionReason::Charge);

        return $user;
    }

    public function test_admin_can_list_payments(): void
    {
        $admin = User::factory()->admin()->create();
        Payment::factory()->paid()->create();

        $this->actingAs($admin)->get(route('admin.payments.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/payments/index')->has('payments.data', 1));
    }

    public function test_non_admin_cannot_access_payments(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.payments.index'))
            ->assertForbidden();
    }

    public function test_admin_can_reverse_a_recent_payment_and_debit_the_wallet(): void
    {
        $admin = User::factory()->admin()->create();
        $user = $this->fundedUser(50000);
        $payment = Payment::factory()->for($user)->paid()->create([
            'amount' => 50000,
            'paid_at' => now()->subMinutes(5),
        ]);

        $this->actingAs($admin)->post(route('admin.payments.reverse', $payment))->assertRedirect();

        $this->assertSame(PaymentStatus::Reversed, $payment->refresh()->status);
        $this->assertSame(0, app(WalletService::class)->balance($user));
    }

    public function test_recent_payment_cannot_be_refunded(): void
    {
        $admin = User::factory()->admin()->create();
        $payment = Payment::factory()->paid()->create(['paid_at' => now()->subMinutes(5)]);

        $this->actingAs($admin)->post(route('admin.payments.refund', $payment))
            ->assertSessionHasErrors('gateway');

        $this->assertSame(PaymentStatus::Paid, $payment->refresh()->status);
    }

    public function test_admin_can_refund_an_old_payment_and_debit_the_wallet(): void
    {
        $admin = User::factory()->admin()->create();
        $user = $this->fundedUser(50000);
        $payment = Payment::factory()->for($user)->paid()->create([
            'amount' => 50000,
            'paid_at' => now()->subMinutes(45),
        ]);

        $this->actingAs($admin)->post(route('admin.payments.refund', $payment))->assertRedirect();

        $this->assertSame(PaymentStatus::Refunded, $payment->refresh()->status);
        $this->assertSame(0, app(WalletService::class)->balance($user));
        $this->assertSame(
            1,
            $user->walletTransactions()->where('reason', WalletTransactionReason::Refund->value)->count(),
        );
    }

    public function test_admin_can_fetch_unverified_transactions(): void
    {
        $admin = User::factory()->admin()->create();
        $this->gateway->unverifiedList = [
            ['authority' => 'A1', 'amount' => 10000, 'callback_url' => 'x', 'date' => '2026-01-01'],
        ];

        $this->actingAs($admin)->getJson(route('admin.payments.unverified'))
            ->assertOk()
            ->assertJsonCount(1, 'authorities');
    }
}
