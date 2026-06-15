<?php

namespace Tests\Feature\Customers;

use App\Enums\CustomerStatus;
use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_a_user_can_view_only_their_own_customers(): void
    {
        $user = User::factory()->create();
        Customer::factory()->for($user)->create(['name' => 'مشتری من']);
        Customer::factory()->create(['name' => 'مشتری دیگری']);

        $this->actingAs($user)
            ->get(route('customers.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('customers/index')
                ->has('customers.data', 1)
                ->where('customers.data.0.name', 'مشتری من')
                ->has('statuses'));
    }

    public function test_a_user_can_create_a_customer(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('customers.store'), [
            'name' => 'سارا محمدی',
            'phone' => '09120000010',
            'city' => 'تهران',
        ])->assertRedirect();

        $this->assertDatabaseHas('customers', [
            'user_id' => $user->id,
            'name' => 'سارا محمدی',
            'phone' => '09120000010',
            'status' => CustomerStatus::Active->value,
        ]);
    }

    public function test_a_user_can_update_a_customer(): void
    {
        $user = User::factory()->create();
        $customer = Customer::factory()->for($user)->create(['name' => 'نام قدیمی']);

        $this->actingAs($user)->put(route('customers.update', $customer), [
            'name' => 'نام جدید',
            'phone' => $customer->phone,
        ])->assertRedirect();

        $this->assertSame('نام جدید', $customer->refresh()->name);
    }

    public function test_a_user_can_block_and_unblock_a_customer(): void
    {
        $user = User::factory()->create();
        $customer = Customer::factory()->for($user)->create();

        $this->actingAs($user)->patch(route('customers.block', $customer))->assertRedirect();
        $this->assertTrue($customer->refresh()->isBlocked());

        $this->actingAs($user)->patch(route('customers.block', $customer))->assertRedirect();
        $this->assertFalse($customer->refresh()->isBlocked());
    }

    public function test_a_user_can_delete_a_customer(): void
    {
        $user = User::factory()->create();
        $customer = Customer::factory()->for($user)->create();

        $this->actingAs($user)->delete(route('customers.destroy', $customer))->assertRedirect();

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }

    public function test_a_user_cannot_manage_another_users_customer(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $customer = Customer::factory()->for($owner)->create();

        $this->actingAs($intruder)->put(route('customers.update', $customer), [
            'name' => 'تغییر غیرمجاز',
        ])->assertForbidden();

        $this->actingAs($intruder)->delete(route('customers.destroy', $customer))->assertForbidden();
    }

    public function test_creating_an_order_creates_and_links_a_customer(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->for($user)->create(['price' => 100000]);

        $this->actingAs($user)->post(route('orders.store'), [
            'customer_name' => 'بهرام نیک',
            'customer_phone' => '09121234567',
            'province' => 'فارس',
            'city' => 'شیراز',
            'status' => OrderStatus::AwaitingConfirmation->value,
            'items' => [
                ['product_id' => $product->id, 'name' => $product->name, 'unit_price' => 100000, 'quantity' => 1],
            ],
        ])->assertRedirect();

        $customer = Customer::query()->where('user_id', $user->id)->where('phone', '09121234567')->first();

        $this->assertNotNull($customer);
        $this->assertSame('بهرام نیک', $customer->name);
        $this->assertSame($customer->id, $user->orders()->firstOrFail()->customer_id);
    }

    public function test_repeat_orders_reuse_the_same_customer_by_phone(): void
    {
        $user = User::factory()->create();

        $payload = [
            'customer_name' => 'مشتری تکراری',
            'customer_phone' => '09129999999',
            'status' => OrderStatus::Proforma->value,
            'items' => [['name' => 'کالا', 'unit_price' => 10000, 'quantity' => 1]],
        ];

        $this->actingAs($user)->post(route('orders.store'), $payload)->assertRedirect();
        $this->actingAs($user)->post(route('orders.store'), $payload)->assertRedirect();

        $this->assertSame(1, $user->customers()->where('phone', '09129999999')->count());
        $this->assertSame(2, $user->orders()->count());
    }

    public function test_an_admin_can_view_all_customers_and_filter_by_owner(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create(['name' => 'فروشنده ویژه']);
        Customer::factory()->for($target)->create();
        Customer::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.customers.index', ['user' => 'فروشنده ویژه']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/customers/index')
                ->has('customers.data', 1));
    }

    public function test_an_admin_can_update_any_customer(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = Customer::factory()->create(['name' => 'قبل']);

        $this->actingAs($admin)->put(route('admin.customers.update', $customer), [
            'name' => 'بعد',
        ])->assertRedirect();

        $this->assertSame('بعد', $customer->refresh()->name);
    }
}
