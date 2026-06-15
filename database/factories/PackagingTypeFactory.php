<?php

namespace Database\Factories;

use App\Models\PackagingType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PackagingType>
 */
class PackagingTypeFactory extends Factory
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
            'name' => fake()->unique()->randomElement([
                'جعبه مقوایی', 'کیسه پلاستیکی', 'بسته‌بندی هدیه', 'کارتن', 'پاکت',
            ]).' '.fake()->randomNumber(3),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
