<?php

namespace Tests\Feature\Financial;

use App\Enums\PaymentStatus;
use App\Enums\WalletTransactionReason;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Payment\Contracts\PaymentGateway;
use App\Services\Wallet\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\FakePaymentGateway;
use Tests\TestCase;

class SubscriptionPlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_charging_the_wallet_starts_a_gateway_payment(): void
    {
        $gateway = new FakePaymentGateway;
        $this->app->instance(PaymentGateway::class, $gateway);

        $user = User::factory()->create();

        // Charging now redirects to the gateway; the wallet is credited later,
        // on the verified callback (see WalletPaymentTest).
        $this->actingAs($user)
            ->post(route('wallet.charge'), ['amount' => 100000])
            ->assertRedirect("https://pay.test/{$gateway->authority}");

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 100000,
            'status' => PaymentStatus::Pending->value,
        ]);
        $this->assertSame(0, app(WalletService::class)->balance($user));
    }

    public function test_user_can_subscribe_to_a_plan_paying_from_their_wallet(): void
    {
        $user = User::factory()->create();
        $service = app(WalletService::class);
        $service->deposit($user, 300000, WalletTransactionReason::Charge);

        $plan = Plan::factory()->create([
            'price' => 200000,
            'discount_percent' => null,
            'is_active' => true,
            'duration_days' => 30,
        ]);

        $this->actingAs($user)
            ->post(route('plans.subscribe', $plan))
            ->assertRedirect(route('plans.index'));

        $this->assertSame(100000, $service->balance($user));
        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
        ]);
    }

    public function test_user_cannot_subscribe_without_enough_balance(): void
    {
        $user = User::factory()->create();
        $plan = Plan::factory()->create(['price' => 200000, 'discount_percent' => null, 'is_active' => true]);

        $this->actingAs($user)
            ->post(route('plans.subscribe', $plan))
            ->assertSessionHasErrors('plan');

        $this->assertDatabaseMissing('subscriptions', ['user_id' => $user->id]);
    }
}
