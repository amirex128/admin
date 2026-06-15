<?php

namespace Database\Factories;

use App\Enums\OrderMode;
use App\Enums\ProductApprovalStatus;
use App\Enums\SalesUnit;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
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
            'parent_id' => null,
            'category_id' => null,
            'packaging_type_id' => null,
            'name' => fake()->words(3, true),
            'sku' => Str::upper(Str::random(8)),
            'description' => '<p>'.fake()->paragraph().'</p>',
            'weight' => fake()->numberBetween(50, 5000),
            'sales_unit' => fake()->randomElement(SalesUnit::cases()),
            'is_special_offer' => fake()->boolean(20),
            'order_mode' => fake()->randomElement(OrderMode::cases()),
            'is_active' => true,
            'approval_status' => ProductApprovalStatus::Approved,
            'price' => fake()->numberBetween(10, 5000) * 1000,
            'stock' => fake()->numberBetween(0, 200),
            'discount_percent' => fake()->optional()->numberBetween(5, 50),
            'variation_attributes' => null,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (): array => ['is_active' => false]);
    }

    /**
     * Indicate that the product is awaiting admin review.
     */
    public function pendingReview(): static
    {
        return $this->state(fn (): array => [
            'approval_status' => ProductApprovalStatus::Pending,
            'reviewed_at' => null,
        ]);
    }

    /**
     * Indicate that the product was rejected with a reason.
     */
    public function rejected(string $reason = 'تصاویر محصول نامناسب است.'): static
    {
        return $this->state(fn (): array => [
            'approval_status' => ProductApprovalStatus::Rejected,
            'rejection_reason' => $reason,
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Indicate that the product is a variation of the given product.
     */
    public function variationOf(Product $parent): static
    {
        return $this->state(fn (): array => [
            'user_id' => $parent->user_id,
            'parent_id' => $parent->id,
            'category_id' => $parent->category_id,
            'packaging_type_id' => $parent->packaging_type_id,
            'name' => $parent->name,
            'variation_attributes' => ['رنگ' => fake()->randomElement(['قرمز', 'آبی', 'سبز'])],
        ]);
    }
}
