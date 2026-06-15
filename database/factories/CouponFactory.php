<?php

namespace Database\Factories;

use App\Enums\DiscountType;
use App\Models\Coupon;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(DiscountType::cases());

        return [
            'user_id' => User::factory(),
            'code' => Str::upper(Str::random(8)),
            'type' => $type,
            'value' => $type === DiscountType::Percentage
                ? fake()->numberBetween(5, 50)
                : fake()->numberBetween(10, 200) * 1000,
            'min_order_amount' => fake()->optional()->numberBetween(100, 1000) * 1000,
            'max_discount_amount' => null,
            'usage_limit' => fake()->optional()->numberBetween(10, 100),
            'used_count' => 0,
            'applies_to_all' => true,
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->addDays(28),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the coupon is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (): array => ['is_active' => false]);
    }
}
