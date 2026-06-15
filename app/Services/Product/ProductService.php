<?php

namespace App\Services\Product;

use App\Enums\MediaCollection;
use App\Http\Requests\User\ProductRequest;
use App\Models\Product;
use App\Models\User;
use App\Services\Media\MediaService;
use Illuminate\Support\Facades\DB;

/**
 * Encapsulates product lifecycle operations that touch multiple tables, such as
 * duplicating a product together with its media, variations and attributes.
 */
class ProductService
{
    public function __construct(private readonly MediaService $mediaService) {}

    /**
     * Create a product for the user together with its attributes, variations
     * and uploaded media.
     */
    public function store(User $user, ProductRequest $request): Product
    {
        return DB::transaction(function () use ($user, $request): Product {
            $product = $user->products()->create($request->productAttributes());

            $this->syncAttributes($product, $request->validated('attributes', []));
            $this->syncVariations($product, $request, $user);
            $this->syncMedia($product, $request, $user);

            return $product->fresh(['attributes.values', 'media', 'variations.media']);
        });
    }

    /**
     * Update a product together with its attributes, variations and media.
     */
    public function update(Product $product, ProductRequest $request): Product
    {
        return DB::transaction(function () use ($product, $request): Product {
            $product->update($request->productAttributes());

            $this->syncAttributes($product, $request->validated('attributes', []));
            $this->syncVariations($product, $request, $product->user);
            $this->syncMedia($product, $request, $product->user);

            return $product->fresh(['attributes.values', 'media', 'variations.media']);
        });
    }

    /**
     * Replace the product's attributes and their values.
     *
     * @param  array<int, array{name: string, values?: array<int, string>}>  $attributes
     */
    protected function syncAttributes(Product $product, array $attributes): void
    {
        $product->attributes()->delete();

        foreach (array_values($attributes) as $index => $attribute) {
            $created = $product->attributes()->create([
                'name' => $attribute['name'],
                'sort_order' => $index,
            ]);

            foreach (array_values($attribute['values'] ?? []) as $valueIndex => $value) {
                $created->values()->create(['value' => $value, 'sort_order' => $valueIndex]);
            }
        }
    }

    /**
     * Create, update and prune the product's variations (stored as child products).
     */
    protected function syncVariations(Product $product, ProductRequest $request, User $user): void
    {
        $variations = $request->validated('variations', []);
        $keptIds = [];

        foreach (array_values($variations) as $index => $variation) {
            $attributes = [
                'name' => $variation['name'] ?? $product->name,
                'sku' => $variation['sku'] ?? null,
                'category_id' => $product->category_id,
                'packaging_type_id' => $product->packaging_type_id,
                'sales_unit' => $product->sales_unit->value,
                'order_mode' => $product->order_mode->value,
                'price' => $variation['price'],
                'stock' => $variation['stock'],
                'discount_percent' => $variation['discount_percent'] ?? null,
                'is_active' => (bool) ($variation['is_active'] ?? true),
                'variation_attributes' => $variation['variation_attributes'] ?? null,
                'sort_order' => $index,
            ];

            $existing = isset($variation['id'])
                ? $product->variations()->whereKey($variation['id'])->first()
                : null;

            if ($existing !== null) {
                $existing->update($attributes);
                $child = $existing;
            } else {
                $child = $product->variations()->create(array_merge($attributes, ['user_id' => $user->id]));
            }

            $keptIds[] = $child->id;

            $this->syncVariationImage($child, $request, $user, $index, (bool) ($variation['remove_image'] ?? false));
        }

        $product->variations()->whereNotIn('id', $keptIds ?: [0])->get()
            ->each(fn (Product $variation) => $this->delete($variation));
    }

    /**
     * Handle the optional dedicated image of a single variation.
     */
    protected function syncVariationImage(Product $variation, ProductRequest $request, User $user, int $index, bool $remove): void
    {
        $file = $request->file("variations.{$index}.image");

        if ($file === null && ! $remove) {
            return;
        }

        $this->mediaService->deleteForModel($variation);

        if ($file !== null) {
            $this->mediaService->store($file, $variation, MediaCollection::Image, $user);
        }
    }

    /**
     * Persist newly uploaded media and remove the media the user discarded.
     */
    protected function syncMedia(Product $product, ProductRequest $request, User $user): void
    {
        foreach ($request->validated('removed_media_ids', []) as $mediaId) {
            $media = $product->media()->whereKey($mediaId)->first();

            if ($media !== null) {
                $this->mediaService->delete($media);
            }
        }

        if ($request->boolean('remove_video') || $request->file('video') !== null) {
            $product->media()->where('collection', MediaCollection::Video->value)->get()
                ->each(fn ($media) => $this->mediaService->delete($media));
        }

        foreach ($request->file('images', []) as $image) {
            $this->mediaService->store($image, $product, MediaCollection::Image, $user);
        }

        if (($video = $request->file('video')) !== null) {
            $this->mediaService->store($video, $product, MediaCollection::Video, $user);
        }
    }

    /**
     * Duplicate a product, including its media, editor images, attributes and
     * variations. Editor image URLs inside the description are rewritten to
     * point at the freshly copied files.
     */
    public function duplicate(Product $product): Product
    {
        return DB::transaction(function () use ($product): Product {
            $product->load(['attributes.values', 'media', 'variations.media']);

            $copy = $this->replicate($product, [
                'name' => $product->name.' (کپی)',
                'sku' => $product->sku !== null ? $product->sku.'-COPY' : null,
            ]);

            foreach ($product->attributes as $attribute) {
                $newAttribute = $copy->attributes()->create([
                    'name' => $attribute->name,
                    'sort_order' => $attribute->sort_order,
                ]);

                foreach ($attribute->values as $value) {
                    $newAttribute->values()->create([
                        'value' => $value->value,
                        'sort_order' => $value->sort_order,
                    ]);
                }
            }

            $this->copyMedia($product, $copy);

            foreach ($product->variations as $variation) {
                $variationCopy = $this->replicate($variation, [
                    'parent_id' => $copy->id,
                ]);

                $this->copyMedia($variation, $variationCopy);
            }

            return $copy->fresh(['attributes.values', 'media', 'variations.media']);
        });
    }

    /**
     * Delete a product and all of its media, variations and attributes.
     */
    public function delete(Product $product): void
    {
        DB::transaction(function () use ($product): void {
            $product->load(['media', 'variations.media']);

            foreach ($product->variations as $variation) {
                $this->mediaService->deleteForModel($variation);
            }

            $this->mediaService->deleteForModel($product);

            // Variations and attributes are removed by the cascading foreign keys.
            $product->delete();
        });
    }

    /**
     * Replicate a single product row applying the given attribute overrides.
     *
     * @param  array<string, mixed>  $overrides
     */
    protected function replicate(Product $product, array $overrides): Product
    {
        $copy = $product->replicate(['id', 'created_at', 'updated_at']);
        $copy->fill($overrides);
        $copy->save();

        return $copy;
    }

    /**
     * Copy every media file from the source product to the target product and
     * rewrite editor image URLs embedded in the duplicated description.
     */
    protected function copyMedia(Product $source, Product $target): void
    {
        $urlMap = [];

        foreach ($source->media as $media) {
            $copy = $this->mediaService->copyTo($media, $target);

            $urlMap[$media->url()] = $copy->url();
        }

        if ($urlMap !== [] && $target->description !== null) {
            $target->update([
                'description' => str_replace(array_keys($urlMap), array_values($urlMap), $target->description),
            ]);
        }
    }
}
