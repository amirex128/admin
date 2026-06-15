<?php

namespace Tests\Feature\Products;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImportTest extends TestCase
{
    use RefreshDatabase;

    private function csvFile(): UploadedFile
    {
        $content = "name,sku,price\n".
            "تیشرت,A-1,5000\n".
            "شلوار,B-2,7000\n";

        return UploadedFile::fake()->createWithContent('products.csv', $content);
    }

    public function test_preview_returns_headers_and_sample_rows(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('products.import.preview'), [
            'file' => $this->csvFile(),
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'headers', 'rows', 'fields'])
            ->assertJsonPath('headers', ['name', 'sku', 'price']);
    }

    public function test_import_creates_new_products_and_updates_existing_ones_by_sku(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $existing = Product::factory()->for($user)->create(['sku' => 'A-1', 'name' => 'قدیمی', 'price' => 1]);

        $token = $this->actingAs($user)->post(route('products.import.preview'), [
            'file' => $this->csvFile(),
        ])->json('token');

        $response = $this->actingAs($user)->post(route('products.import.run'), [
            'token' => $token,
            'mapping' => ['name' => 0, 'sku' => 1, 'price' => 2],
        ]);

        $response->assertRedirect(route('products.index'));

        $this->assertDatabaseHas('products', ['sku' => 'A-1', 'name' => 'تیشرت', 'price' => 5000]);
        $this->assertDatabaseHas('products', ['sku' => 'B-2', 'name' => 'شلوار', 'price' => 7000]);
        $this->assertSame(2, $user->products()->count());
        $this->assertSame($existing->id, $user->products()->where('sku', 'A-1')->first()->id);
    }
}
