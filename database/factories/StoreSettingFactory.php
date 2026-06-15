<?php

namespace Database\Factories;

use App\Models\StoreSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StoreSetting>
 */
class StoreSettingFactory extends Factory
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
            'province_id' => null,
            'city_id' => null,
            'card_to_card_enabled' => false,
            'zarinpal_enabled' => false,
            'vat_percent' => 9,
            'refund_window_minutes' => 30,
            'shipping_methods' => null,
            'intra_city_days' => 1,
            'inter_city_days' => 3,
        ];
    }
}
