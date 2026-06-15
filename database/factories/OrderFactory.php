<?php

namespace Database\Factories;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\ShippingMethod;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(50, 5000) * 1000;
        $taxPercent = fake()->randomElement([0, 9, 10]);
        $taxAmount = (int) round($subtotal * $taxPercent / 100);
        $shippingCost = fake()->randomElement([0, 35000, 60000]);

        return [
            'user_id' => User::factory(),
            'code' => 'ORD-'.Str::upper(Str::random(8)),
            'status' => fake()->randomElement(OrderStatus::cases()),
            'payment_status' => fake()->randomElement(OrderPaymentStatus::cases()),
            'customer_name' => fake()->name(),
            'customer_phone' => '0912'.fake()->numerify('#######'),
            'province' => fake()->randomElement(['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'گیلان']),
            'city' => fake()->randomElement(['تهران', 'اصفهان', 'شیراز', 'مشهد', 'رشت']),
            'address' => fake()->address(),
            'shipping_method' => fake()->randomElement(ShippingMethod::cases()),
            'payment_method' => fake()->randomElement(OrderPaymentMethod::cases()),
            'tracking_code' => null,
            'subtotal' => $subtotal,
            'tax_percent' => $taxPercent,
            'tax_amount' => $taxAmount,
            'shipping_cost' => $shippingCost,
            'total' => $subtotal + $taxAmount + $shippingCost,
            'note' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the order is a downloadable proforma (pre-invoice).
     */
    public function proforma(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Proforma,
            'payment_status' => OrderPaymentStatus::Unpaid,
        ]);
    }

    /**
     * Indicate that the order has been paid.
     */
    public function paid(): static
    {
        return $this->state(fn (): array => [
            'payment_status' => OrderPaymentStatus::Paid,
            'paid_at' => now(),
        ]);
    }
}
