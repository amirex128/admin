<?php

namespace Tests\Feature\Admin;

use App\Models\Plan;
use App\Models\User;
use App\Services\Wallet\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admins_cannot_access_the_admin_users_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_admins_can_view_the_users_list(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(3)->create();

        $this->withoutVite()
            ->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk();
    }

    public function test_admin_can_adjust_a_user_wallet_balance(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->post(route('admin.users.wallet.store', $user), [
                'type' => 'credit',
                'amount' => 75000,
                'description' => 'هدیه',
            ])
            ->assertRedirect();

        $this->assertSame(75000, app(WalletService::class)->balance($user));
    }

    public function test_admin_can_create_a_plan(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post(route('admin.plans.store'), [
                'name' => 'پلن تستی',
                'price' => 120000,
                'billing_period' => 'monthly',
                'duration_days' => 30,
                'features' => ['ویژگی یک', 'ویژگی دو'],
                'is_active' => true,
                'is_featured' => false,
            ])
            ->assertRedirect(route('admin.plans.index'));

        $this->assertDatabaseHas('plans', ['name' => 'پلن تستی', 'price' => 120000]);
    }

    public function test_admin_can_toggle_a_plan_active_state(): void
    {
        $admin = User::factory()->admin()->create();
        $plan = Plan::factory()->create(['is_active' => true]);

        $this->actingAs($admin)
            ->patch(route('admin.plans.toggle', $plan))
            ->assertRedirect();

        $this->assertFalse($plan->fresh()->is_active);
    }
}
