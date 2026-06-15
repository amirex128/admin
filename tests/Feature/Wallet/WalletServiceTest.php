<?php

namespace Tests\Feature\Wallet;

use App\Enums\WalletTransactionReason;
use App\Enums\WalletTransactionType;
use App\Models\User;
use App\Services\Wallet\InsufficientBalanceException;
use App\Services\Wallet\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class WalletServiceTest extends TestCase
{
    use RefreshDatabase;

    private WalletService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(WalletService::class);
    }

    public function test_a_new_user_starts_with_a_zero_balance(): void
    {
        $user = User::factory()->create();

        $this->assertSame(0, $this->service->balance($user));
    }

    public function test_deposit_increases_balance_and_records_a_credit(): void
    {
        $user = User::factory()->create();

        $transaction = $this->service->deposit($user, 50000, WalletTransactionReason::Charge);

        $this->assertSame(50000, $this->service->balance($user));
        $this->assertSame(WalletTransactionType::Credit, $transaction->type);
        $this->assertSame(50000, $transaction->balance_after);
    }

    public function test_withdraw_decreases_balance_and_records_a_debit(): void
    {
        $user = User::factory()->create();
        $this->service->deposit($user, 50000, WalletTransactionReason::Charge);

        $transaction = $this->service->withdraw($user, 20000, WalletTransactionReason::SubscriptionPurchase);

        $this->assertSame(30000, $this->service->balance($user));
        $this->assertSame(WalletTransactionType::Debit, $transaction->type);
    }

    public function test_withdraw_fails_when_balance_is_insufficient(): void
    {
        $user = User::factory()->create();

        $this->expectException(InsufficientBalanceException::class);

        $this->service->withdraw($user, 1000, WalletTransactionReason::SubscriptionPurchase);
    }

    public function test_admin_adjustment_supports_positive_and_negative_amounts(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();

        $this->service->adjust($user, 80000, $admin);
        $this->assertSame(80000, $this->service->balance($user));

        $debit = $this->service->adjust($user, -30000, $admin);
        $this->assertSame(50000, $this->service->balance($user));
        $this->assertSame($admin->id, $debit->performed_by);
        $this->assertSame(WalletTransactionReason::AdminAdjustment, $debit->reason);
    }

    public function test_amount_must_be_positive(): void
    {
        $user = User::factory()->create();

        $this->expectException(InvalidArgumentException::class);

        $this->service->deposit($user, 0, WalletTransactionReason::Charge);
    }
}
