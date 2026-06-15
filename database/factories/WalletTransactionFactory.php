<?php

namespace Database\Factories;

use App\Enums\WalletTransactionReason;
use App\Enums\WalletTransactionType;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WalletTransaction>
 */
class WalletTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(WalletTransactionType::cases());
        $amount = fake()->numberBetween(10, 1000) * 1000;

        return [
            'wallet_id' => Wallet::factory(),
            'user_id' => User::factory(),
            'type' => $type,
            'reason' => fake()->randomElement(WalletTransactionReason::cases()),
            'amount' => $amount,
            'balance_after' => fake()->numberBetween(0, 5000) * 1000,
            'description' => fake()->optional()->sentence(3),
            'meta' => null,
        ];
    }
}
