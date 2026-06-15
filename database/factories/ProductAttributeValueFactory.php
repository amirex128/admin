<?php

namespace Database\Factories;

use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductAttributeValue>
 */
class ProductAttributeValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_attribute_id' => ProductAttribute::factory(),
            'value' => fake()->randomElement(['قرمز', 'آبی', 'سبز', '۱۸ ماه', '۳۶ ماه', 'بزرگ', 'کوچک']),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
