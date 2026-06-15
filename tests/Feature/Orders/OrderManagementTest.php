<?php

namespace Tests\Feature\Orders;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_a_user_can_view_only_their_own_orders(): void
    {
        $user = User::factory()->create();
        Order::factory()->for($user)->create(['customer_name' => 'مشتری من']);
        Order::factory()->create(['customer_name' => 'مشتری دیگری']);

        $this->actingAs($user)
            ->get(route('orders.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('orders/index')
                ->has('orders.data', 1)
                ->where('orders.data.0.customer_name', 'مشتری من')
                ->has('statusTabs'));
    }

    public function test_a_user_can_create_an_order_with_items(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->for($user)->create(['price' => 100000]);

        $response = $this->actingAs($user)->post(route('orders.store'), [
            'customer_name' => 'علی رضایی',
            'customer_phone' => '09120000009',
            'province' => 'تهران',
            'city' => 'تهران',
            'status' => OrderStatus::AwaitingConfirmation->value,
            'tax_percent' => 10,
            'shipping_cost' => 50000,
            'items' => [
                ['product_id' => $product->id, 'name' => $product->name, 'unit_price' => 100000, 'quantity' => 2, 'discount_percent' => 0],
            ],
        ]);

        $order = Order::query()->where('user_id', $user->id)->firstOrFail();

        $response->assertRedirect(route('orders.show', $order));

        $this->assertSame(1, $order->items()->count());
        $this->assertSame(200000, $order->subtotal);
        $this->assertSame(20000, $order->tax_amount);
        $this->assertSame(270000, $order->total);
        $this->assertSame(OrderStatus::AwaitingConfirmation, $order->status);
        $this->assertSame(1, $order->statusHistories()->count());
    }

    public function test_a_user_can_issue_a_proforma(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('orders.store'), [
            'customer_name' => 'مشتری',
            'status' => OrderStatus::Proforma->value,
            'items' => [
                ['name' => 'کالای دستی', 'unit_price' => 50000, 'quantity' => 1],
            ],
        ])->assertRedirect();

        $order = Order::query()->where('user_id', $user->id)->firstOrFail();

        $this->assertTrue($order->isProforma());
        $this->assertSame(OrderPaymentStatus::Unpaid, $order->payment_status);
    }

    public function test_a_user_can_advance_the_order_status_and_record_tracking(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create(['status' => OrderStatus::Preparing]);

        $this->actingAs($user)->patch(route('orders.status', $order), [
            'status' => OrderStatus::Shipping->value,
            'tracking_code' => 'TRK-123456',
            'note' => 'ارسال شد',
        ])->assertRedirect();

        $order->refresh();

        $this->assertSame(OrderStatus::Shipping, $order->status);
        $this->assertSame('TRK-123456', $order->tracking_code);
        $this->assertNotNull($order->shipped_at);
        $this->assertSame(1, $order->statusHistories()->where('status', OrderStatus::Shipping)->count());
    }

    public function test_a_user_can_mark_an_order_as_paid(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create(['payment_status' => OrderPaymentStatus::Unpaid]);

        $this->actingAs($user)->patch(route('orders.payment', $order), [
            'payment_status' => OrderPaymentStatus::Paid->value,
        ])->assertRedirect();

        $order->refresh();

        $this->assertSame(OrderPaymentStatus::Paid, $order->payment_status);
        $this->assertNotNull($order->paid_at);
    }

    public function test_a_user_can_download_the_order_pdf(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->for($user)->create();

        $response = $this->actingAs($user)->get(route('orders.pdf', $order));

        $response->assertOk();
        $this->assertSame('application/pdf', $response->headers->get('content-type'));
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }

    public function test_a_user_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $order = Order::factory()->for($owner)->create();

        $this->actingAs($intruder)->get(route('orders.show', $order))->assertForbidden();
        $this->actingAs($intruder)->patch(route('orders.status', $order), [
            'status' => OrderStatus::Delivered->value,
        ])->assertForbidden();
    }

    public function test_the_unpaid_tab_filters_orders_by_payment_status(): void
    {
        $user = User::factory()->create();
        Order::factory()->for($user)->create(['payment_status' => OrderPaymentStatus::Unpaid]);
        Order::factory()->for($user)->paid()->create();

        $this->actingAs($user)
            ->get(route('orders.index', ['status' => OrderPaymentStatus::Unpaid->value]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('orders.data', 1));
    }

    public function test_an_admin_can_view_all_orders_and_filter_by_owner(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create(['name' => 'فروشنده ویژه']);
        Order::factory()->for($target)->create();
        Order::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.orders.index', ['user' => 'فروشنده ویژه']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/orders/index')
                ->has('orders.data', 1));
    }

    public function test_an_admin_can_create_an_order_for_a_user(): void
    {
        $admin = User::factory()->admin()->create();
        $seller = User::factory()->create();
        $product = Product::factory()->for($seller)->create(['price' => 80000]);

        $this->actingAs($admin)->post(route('admin.orders.store'), [
            'user_id' => $seller->id,
            'customer_name' => 'مشتری ادمین',
            'status' => OrderStatus::AwaitingConfirmation->value,
            'items' => [
                ['product_id' => $product->id, 'name' => $product->name, 'unit_price' => 80000, 'quantity' => 1],
            ],
        ])->assertRedirect();

        $order = Order::query()->where('user_id', $seller->id)->firstOrFail();

        $this->assertSame('مشتری ادمین', $order->customer_name);
        $this->assertSame(80000, $order->total);
    }
}
