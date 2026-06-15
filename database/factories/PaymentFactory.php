<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => fake()->numberBetween(10, 500) * 1000,
            'authority' => 'A'.Str::upper(Str::random(35)),
            'ref_id' => null,
            'card_pan' => null,
            'fee' => null,
            'status' => PaymentStatus::Pending,
            'description' => 'شارژ کیف پول',
            'paid_at' => null,
            'meta' => null,
        ];
    }

    /**
     * Indicate the payment was completed successfully.
     */
    public function paid(): static
    {
        return $this->state(fn (): array => [
            'status' => PaymentStatus::Paid,
            'ref_id' => (string) fake()->numberBetween(100000, 999999),
            'card_pan' => '6037********'.fake()->numberBetween(1000, 9999),
            'paid_at' => now(),
        ]);
    }
}
