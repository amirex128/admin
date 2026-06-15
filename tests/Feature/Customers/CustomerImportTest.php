<?php

namespace Tests\Feature\Customers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CustomerImportTest extends TestCase
{
    use RefreshDatabase;

    private function csvFile(): UploadedFile
    {
        $content = "name,phone,city\n".
            "علی رضایی,09120000001,تهران\n".
            "زهرا کریمی,09120000002,اصفهان\n";

        return UploadedFile::fake()->createWithContent('customers.csv', $content);
    }

    public function test_preview_returns_headers_and_sample_rows(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('customers.import.preview'), [
            'file' => $this->csvFile(),
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'headers', 'rows', 'fields'])
            ->assertJsonPath('headers', ['name', 'phone', 'city']);
    }

    public function test_import_creates_new_customers_and_updates_existing_ones_by_phone(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $existing = Customer::factory()->for($user)->create(['phone' => '09120000001', 'name' => 'قدیمی']);

        $token = $this->actingAs($user)->post(route('customers.import.preview'), [
            'file' => $this->csvFile(),
        ])->json('token');

        $this->actingAs($user)->post(route('customers.import.run'), [
            'token' => $token,
            'mapping' => ['name' => 0, 'phone' => 1, 'city' => 2],
        ])->assertRedirect(route('customers.index'));

        $this->assertDatabaseHas('customers', ['phone' => '09120000001', 'name' => 'علی رضایی', 'city' => 'تهران']);
        $this->assertDatabaseHas('customers', ['phone' => '09120000002', 'name' => 'زهرا کریمی']);
        $this->assertSame(2, $user->customers()->count());
        $this->assertSame($existing->id, $user->customers()->where('phone', '09120000001')->first()->id);
    }
}
