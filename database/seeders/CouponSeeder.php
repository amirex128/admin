<?php

namespace Database\Seeders;

use App\Enums\DiscountType;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Seed demo coupons for the test user, including one targeting specific
     * products.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create();

        Coupon::factory()->for($user)->create([
            'code' => 'WELCOME15',
            'type' => DiscountType::Percentage,
            'value' => 15,
            'applies_to_all' => true,
        ]);

        $targeted = Coupon::factory()->for($user)->create([
            'code' => 'PARCHE50K',
            'type' => DiscountType::Fixed,
            'value' => 50000,
            'applies_to_all' => false,
        ]);

        $products = Product::query()->ownedBy($user)->roots()->limit(3)->pluck('id');
        $targeted->products()->sync($products);

        Coupon::factory()->for($user)->inactive()->create(['code' => 'EXPIRED10']);
    }
}
