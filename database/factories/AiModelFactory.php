<?php

namespace Database\Factories;

use App\Models\AiModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Laravel\Ai\Enums\Lab;

/**
 * @extends Factory<AiModel>
 */
class AiModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(['هوش سریع', 'هوش پیشرفته', 'هوش اقتصادی']).' '.fake()->randomNumber(2),
            'provider' => fake()->randomElement([Lab::OpenAI->value, Lab::Anthropic->value, Lab::Gemini->value]),
            'model_identifier' => fake()->randomElement(['gpt-4o-mini', 'claude-haiku-4-5-20251001', 'gemini-2.0-flash']),
            'description' => fake()->optional()->sentence(),
            'price_per_1k_tokens' => fake()->numberBetween(50, 5000),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the model is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (): array => ['is_active' => false]);
    }
}
