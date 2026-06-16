<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([IranLocationSeeder::class, PlanSeeder::class, AiModelSeeder::class]);

        User::factory()->admin()->create([
            'name' => 'Admin User',
            'phone' => '09120000000',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'phone' => '09120000001',
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $this->call([StoreSettingSeeder::class, ProductSeeder::class, PaymentSeeder::class, OrderSeeder::class, CustomerSeeder::class, CouponSeeder::class]);
    }
}
