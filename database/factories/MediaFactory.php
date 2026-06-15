<?php

namespace Database\Factories;

use App\Enums\MediaCollection;
use App\Models\Media;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
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
            'mediable_type' => (new Product)->getMorphClass(),
            'mediable_id' => Product::factory(),
            'collection' => MediaCollection::Image->value,
            'disk' => 'public',
            'path' => 'products/'.fake()->uuid().'.jpg',
            'original_name' => fake()->word().'.jpg',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(10_000, 5_000_000),
            'sort_order' => fake()->numberBetween(0, 19),
        ];
    }

    /**
     * Indicate the media belongs to the video collection.
     */
    public function video(): static
    {
        return $this->state(fn (): array => [
            'collection' => MediaCollection::Video->value,
            'path' => 'products/'.fake()->uuid().'.mp4',
            'mime_type' => 'video/mp4',
        ]);
    }
}
