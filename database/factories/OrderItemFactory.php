<?php

namespace Database\Factories;

use App\Enums\SalesUnit;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $unitPrice = fake()->numberBetween(10, 2000) * 1000;
        $quantity = fake()->numberBetween(1, 5);
        $discountPercent = fake()->randomElement([0, 0, 10, 20]);
        $total = (int) round($unitPrice * $quantity * (100 - $discountPercent) / 100);

        return [
            'order_id' => Order::factory(),
            'product_id' => null,
            'name' => fake()->words(3, true),
            'sales_unit' => fake()->randomElement(SalesUnit::cases()),
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'discount_percent' => $discountPercent,
            'total' => $total,
        ];
    }
}
