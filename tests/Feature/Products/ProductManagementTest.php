<?php

namespace Tests\Feature\Products;

use App\Enums\MediaCollection;
use App\Enums\OrderMode;
use App\Enums\SalesUnit;
use App\Models\Media;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_a_user_can_view_only_their_own_products(): void
    {
        $user = User::factory()->create();
        Product::factory()->for($user)->create(['name' => 'محصول من']);
        Product::factory()->create(['name' => 'محصول دیگری']);

        $response = $this->actingAs($user)->get(route('products.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products/index')
                ->has('products.data', 1)
                ->where('products.data.0.name', 'محصول من'));
    }

    public function test_a_user_can_create_a_product_with_attributes_variations_and_media(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('products.store'), [
            'name' => 'تیشرت',
            'sku' => 'TS-1',
            'sales_unit' => SalesUnit::Piece->value,
            'order_mode' => OrderMode::Direct->value,
            'price' => 250000,
            'stock' => 12,
            'is_active' => true,
            'attributes' => [
                ['name' => 'رنگ', 'values' => ['قرمز', 'آبی']],
            ],
            'variations' => [
                [
                    'variation_attributes' => ['رنگ' => 'قرمز'],
                    'price' => 260000,
                    'stock' => 5,
                    'is_active' => true,
                    'image' => UploadedFile::fake()->image('red.jpg'),
                ],
            ],
            'images' => [
                UploadedFile::fake()->image('main.jpg'),
            ],
            'video' => UploadedFile::fake()->create('clip.mp4', 1000, 'video/mp4'),
        ]);

        $response->assertRedirect(route('products.index'));

        $product = Product::query()->roots()->where('sku', 'TS-1')->firstOrFail();

        $this->assertSame(1, $product->attributes()->count());
        $this->assertSame(2, $product->attributes()->first()->values()->count());
        $this->assertSame(1, $product->variations()->count());
        $this->assertSame(1, $product->media()->where('collection', MediaCollection::Image->value)->count());
        $this->assertSame(1, $product->media()->where('collection', MediaCollection::Video->value)->count());
        $this->assertSame(1, $product->variations()->first()->media()->count());
        Storage::disk('public')->assertExists($product->media()->first()->path);
    }

    public function test_a_user_can_update_a_product_and_remove_media(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $product = Product::factory()->for($user)->create();
        $media = Media::factory()->create(['mediable_id' => $product->id, 'user_id' => $user->id]);
        Storage::disk('public')->put($media->path, 'x');

        $response = $this->actingAs($user)->post(route('products.update', $product), [
            'name' => 'نام جدید',
            'sales_unit' => SalesUnit::Meter->value,
            'order_mode' => OrderMode::PreInvoice->value,
            'price' => 999,
            'stock' => 3,
            'removed_media_ids' => [$media->id],
        ]);

        $response->assertRedirect(route('products.index'));
        $this->assertSame('نام جدید', $product->fresh()->name);
        $this->assertDatabaseMissing('media', ['id' => $media->id]);
        Storage::disk('public')->assertMissing($media->path);
    }

    public function test_duplicating_a_product_copies_variations_and_media(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $product = Product::factory()->for($user)->create(['name' => 'اصلی']);
        $media = Media::factory()->create(['mediable_id' => $product->id, 'user_id' => $user->id]);
        Storage::disk('public')->put($media->path, 'binary');
        Product::factory()->variationOf($product)->create();

        $this->actingAs($user)->post(route('products.duplicate', $product))
            ->assertRedirect();

        $copy = Product::query()->roots()->where('name', 'اصلی (کپی)')->firstOrFail();
        $this->assertSame(1, $copy->variations()->count());
        $this->assertSame(1, $copy->media()->count());
        $this->assertNotSame($media->path, $copy->media()->first()->path);
        Storage::disk('public')->assertExists($copy->media()->first()->path);
    }

    public function test_a_user_can_toggle_and_delete_their_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->for($user)->create(['is_active' => true]);

        $this->actingAs($user)->patch(route('products.toggle', $product))->assertRedirect();
        $this->assertFalse($product->fresh()->is_active);

        $this->actingAs($user)->delete(route('products.destroy', $product))->assertRedirect();
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_a_user_cannot_modify_another_users_product(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $product = Product::factory()->for($owner)->create();

        $this->actingAs($intruder)->patch(route('products.toggle', $product))->assertForbidden();
        $this->actingAs($intruder)->delete(route('products.destroy', $product))->assertForbidden();
    }

    public function test_an_admin_can_filter_products_by_owner(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create(['name' => 'فروشنده ویژه']);
        Product::factory()->for($target)->create(['name' => 'کالای هدف']);
        Product::factory()->create();

        $this->actingAs($admin)->get(route('admin.products.index', ['user' => 'ویژه']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/products/index')
                ->has('products.data', 1)
                ->where('products.data.0.name', 'کالای هدف'));
    }
}
