<?php

namespace Tests\Feature\Settings;

use App\Models\City;
use App\Models\Province;
use App\Models\StoreSetting;
use App\Models\User;
use App\Services\Order\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreSettingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_a_user_can_view_their_store_settings(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('settings.store.edit'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('settings/store')
                ->has('settings')
                ->has('provinces')
                ->has('shippingMethods'));
    }

    public function test_a_user_can_update_their_store_settings(): void
    {
        $user = User::factory()->create();
        $province = Province::factory()->create(['name' => 'تهران']);
        $city = City::factory()->create(['province_id' => $province->id, 'name' => 'تهران']);

        $this->actingAs($user)->put(route('settings.store.update'), [
            'province_id' => $province->id,
            'city_id' => $city->id,
            'card_to_card_enabled' => true,
            'card_holder_name' => 'علی رضایی',
            'card_number' => '6037991234567890',
            'zarinpal_enabled' => true,
            'zarinpal_merchant_id' => 'merchant-123',
            'zarinpal_access_token' => 'secret-token',
            'vat_percent' => 9,
            'refund_window_minutes' => 30,
            'intra_city_days' => 2,
            'inter_city_days' => 4,
            'shipping_methods' => [
                'post' => ['enabled' => true, 'intra_cost' => 30000, 'inter_cost' => 60000],
            ],
        ])->assertRedirect();

        $settings = $user->storeSetting()->firstOrFail();

        $this->assertSame($city->id, $settings->city_id);
        $this->assertTrue($settings->card_to_card_enabled);
        $this->assertSame(9, $settings->vat_percent);
        $this->assertSame('secret-token', $settings->zarinpal_access_token);
        $this->assertSame(30000, $settings->shipping_methods['post']['intra_cost']);
        $this->assertSame(2, $settings->intra_city_days);
    }

    public function test_enabling_zarinpal_requires_merchant_credentials(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put(route('settings.store.update'), [
            'zarinpal_enabled' => true,
        ])->assertSessionHasErrors(['zarinpal_merchant_id', 'zarinpal_access_token']);
    }

    public function test_new_orders_default_to_the_store_vat_percent(): void
    {
        $user = User::factory()->create();
        StoreSetting::factory()->for($user)->create(['vat_percent' => 9]);

        $service = app(OrderService::class);
        $order = $service->create($user, [
            'customer_name' => 'مشتری',
            'status' => 'awaiting_confirmation',
            'items' => [
                ['name' => 'کالا', 'unit_price' => 100000, 'quantity' => 1, 'discount_percent' => 0],
            ],
        ]);

        $this->assertSame(9, $order->tax_percent);
        $this->assertSame(9000, $order->tax_amount);
        $this->assertSame(109000, $order->total);
    }

    public function test_the_zarinpal_token_is_encrypted_at_rest(): void
    {
        $user = User::factory()->create();
        $settings = StoreSetting::factory()->for($user)->create();
        $settings->update(['zarinpal_access_token' => 'plain-secret']);

        $raw = \DB::table('store_settings')->where('id', $settings->id)->value('zarinpal_access_token');

        $this->assertNotSame('plain-secret', $raw);
        $this->assertSame('plain-secret', $settings->fresh()->zarinpal_access_token);
    }

    public function test_an_admin_can_update_a_users_store_settings(): void
    {
        $admin = User::factory()->admin()->create();
        $seller = User::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.users.store-settings.edit', $seller))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/users/store-settings'));

        $this->actingAs($admin)->put(route('admin.users.store-settings.update', $seller), [
            'vat_percent' => 10,
        ])->assertRedirect();

        $this->assertSame(10, $seller->storeSetting()->firstOrFail()->vat_percent);
    }

    public function test_a_non_admin_cannot_manage_another_users_store_settings(): void
    {
        $user = User::factory()->create();
        $seller = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.users.store-settings.edit', $seller))
            ->assertForbidden();
    }
}
