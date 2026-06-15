<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductAttribute>
 */
class ProductAttributeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->randomElement(['رنگ', 'گارانتی', 'سایز', 'جنس']),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
