<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Seed a few demo gateway payments for the test user.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create();

        Payment::factory()->for($user)->paid()->count(3)->create();
        Payment::factory()->for($user)->count(2)->create();
    }
}
