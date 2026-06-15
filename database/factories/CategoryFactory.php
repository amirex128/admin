<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'پوشاک', 'الکترونیک', 'لوازم خانگی', 'کتاب', 'آرایشی و بهداشتی', 'ورزشی', 'ابزار',
        ]).' '.fake()->randomNumber(3);

        return [
            'user_id' => User::factory(),
            'parent_id' => null,
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
        ];
    }

    /**
     * Indicate that the category is a child of the given category.
     */
    public function childOf(Category $parent): static
    {
        return $this->state(fn (): array => [
            'user_id' => $parent->user_id,
            'parent_id' => $parent->id,
        ]);
    }
}
