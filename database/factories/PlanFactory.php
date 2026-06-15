<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement(['برنزی', 'نقره‌ای', 'طلایی', 'الماس']).' '.fake()->randomNumber(2);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(50, 2000) * 1000,
            'billing_period' => fake()->randomElement(['monthly', 'quarterly', 'yearly']),
            'duration_days' => fake()->randomElement([30, 90, 365]),
            'features' => [
                'پشتیبانی ۲۴ ساعته',
                'فضای ذخیره‌سازی نامحدود',
                'گزارش‌های پیشرفته',
            ],
            'discount_percent' => fake()->optional()->numberBetween(5, 40),
            'discount_badge' => fake()->optional()->randomElement(['پرفروش', 'پیشنهاد ویژه', 'محبوب']),
            'is_active' => true,
            'is_featured' => fake()->boolean(30),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the plan is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
