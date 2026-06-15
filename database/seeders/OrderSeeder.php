<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class OrderSeeder extends Seeder
{
    /**
     * Seed demo orders (and a proforma) for the test user.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create();

        $products = Product::query()->where('user_id', $user->id)->whereNull('parent_id')->get();

        Order::factory()
            ->count(6)
            ->for($user)
            ->create()
            ->each(function (Order $order) use ($products): void {
                $this->attachItems($order, $products);
                $order->statusHistories()->create(['status' => $order->status]);
            });

        $proforma = Order::factory()
            ->proforma()
            ->for($user)
            ->create(['customer_name' => 'مشتری نمونه']);

        $this->attachItems($proforma, $products);
        $proforma->statusHistories()->create(['status' => OrderStatus::Proforma]);
    }

    /**
     * Attach a couple of line items to the order and recalculate its totals.
     *
     * @param  Collection<int, Product>  $products
     */
    protected function attachItems(Order $order, $products): void
    {
        $count = max(1, min(3, $products->count()));

        if ($products->isEmpty()) {
            $items = OrderItem::factory()->count(2)->for($order)->create();
        } else {
            $items = $products->random($count)->map(function (Product $product) use ($order) {
                $quantity = fake()->numberBetween(1, 4);

                return OrderItem::factory()->for($order)->create([
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sales_unit' => $product->sales_unit,
                    'unit_price' => $product->price,
                    'quantity' => $quantity,
                    'discount_percent' => 0,
                    'total' => $product->price * $quantity,
                ]);
            });
        }

        $subtotal = $items->sum('total');
        $taxAmount = (int) round($subtotal * $order->tax_percent / 100);

        $order->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total' => $subtotal + $taxAmount + $order->shipping_cost,
        ]);
    }
}
