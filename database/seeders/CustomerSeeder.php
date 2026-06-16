<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Seed demo customers for the test user and backfill customers from any
     * orders that were created before the CRM existed.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create();

        Customer::factory()->count(12)->for($user)->create();
        Customer::factory()->count(2)->for($user)->blocked()->create();

        // A known storefront account for demoing customer login (09120000050 / password).
        $account = Customer::factory()->for($user)->create([
            'name' => 'مشتری نمونه',
            'phone' => '09120000050',
            'email' => 'customer@example.com',
        ]);
        $account->password = 'password';
        $account->save();

        $this->backfillFromOrders($user);
    }

    /**
     * Link existing orders to a customer record (creating one when needed).
     */
    protected function backfillFromOrders(User $user): void
    {
        Order::query()
            ->where('user_id', $user->id)
            ->whereNull('customer_id')
            ->get()
            ->each(function (Order $order) use ($user): void {
                $customer = $user->customers()
                    ->when(
                        $order->customer_phone !== null,
                        fn ($q) => $q->where('phone', $order->customer_phone),
                        fn ($q) => $q->whereNull('phone')->where('name', $order->customer_name),
                    )
                    ->first()
                    ?? $user->customers()->create([
                        'name' => $order->customer_name,
                        'phone' => $order->customer_phone,
                        'province' => $order->province,
                        'city' => $order->city,
                        'address' => $order->address,
                    ]);

                $order->update(['customer_id' => $customer->id]);
            });
    }
}
