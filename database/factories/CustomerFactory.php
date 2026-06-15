<?php

namespace Database\Factories;

use App\Enums\CustomerStatus;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
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
            'name' => fake()->name(),
            'phone' => '09'.fake()->numerify('#########'),
            'email' => fake()->optional()->safeEmail(),
            'national_code' => fake()->optional()->numerify('##########'),
            'province' => fake()->randomElement(['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'البرز']),
            'city' => fake()->randomElement(['تهران', 'اصفهان', 'شیراز', 'مشهد', 'کرج']),
            'address' => fake()->optional()->address(),
            'postal_code' => fake()->optional()->numerify('##########'),
            'status' => CustomerStatus::Active,
            'note' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the customer is blocked.
     */
    public function blocked(): static
    {
        return $this->state(fn (): array => ['status' => CustomerStatus::Blocked]);
    }
}
