<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PackagingType;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed demo products, categories and packaging types for the test user.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create();

        $category = Category::factory()->for($user)->create(['name' => 'پوشاک']);
        Category::factory()->childOf($category)->create(['name' => 'تیشرت']);

        $packaging = PackagingType::factory()->for($user)->create(['name' => 'جعبه مقوایی']);

        Product::factory()
            ->count(8)
            ->for($user)
            ->create([
                'category_id' => $category->id,
                'packaging_type_id' => $packaging->id,
            ])
            ->each(function (Product $product): void {
                $attribute = ProductAttribute::factory()->for($product)->create(['name' => 'رنگ']);
                $attribute->values()->createMany([
                    ['value' => 'قرمز', 'sort_order' => 0],
                    ['value' => 'آبی', 'sort_order' => 1],
                ]);

                Product::factory()->variationOf($product)->count(2)->create();
            });
    }
}
