<?php

namespace App\Http\Requests\User;

use App\Enums\MediaCollection;
use App\Enums\OrderMode;
use App\Enums\SalesUnit;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Shared validation for creating and updating products together with their
 * attributes, variations and media.
 */
abstract class ProductRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;
        $imageMax = MediaCollection::Image->maxSizeKilobytes();

        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', Rule::exists('categories', 'id')->where('user_id', $userId)],
            'packaging_type_id' => ['nullable', Rule::exists('packaging_types', 'id')->where('user_id', $userId)],
            'description' => ['nullable', 'string'],
            'weight' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'sales_unit' => ['required', Rule::enum(SalesUnit::class)],
            'order_mode' => ['required', Rule::enum(OrderMode::class)],
            'is_special_offer' => ['boolean'],
            'is_active' => ['boolean'],
            'price' => ['required', 'integer', 'min:0', 'max:100000000000'],
            'stock' => ['required', 'integer', 'min:0', 'max:1000000'],
            'discount_percent' => ['nullable', 'integer', 'min:0', 'max:100'],

            'attributes' => ['array'],
            'attributes.*.name' => ['required', 'string', 'max:255'],
            'attributes.*.values' => ['array'],
            'attributes.*.values.*' => ['required', 'string', 'max:255'],

            'variations' => ['array'],
            'variations.*.id' => ['nullable', 'integer'],
            'variations.*.name' => ['nullable', 'string', 'max:255'],
            'variations.*.sku' => ['nullable', 'string', 'max:255'],
            'variations.*.variation_attributes' => ['nullable', 'array'],
            'variations.*.price' => ['required', 'integer', 'min:0', 'max:100000000000'],
            'variations.*.stock' => ['required', 'integer', 'min:0', 'max:1000000'],
            'variations.*.discount_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'variations.*.is_active' => ['boolean'],
            'variations.*.image' => ['nullable', 'image', "max:{$imageMax}"],
            'variations.*.remove_image' => ['boolean'],

            'images' => ['array', 'max:'.MediaCollection::Image->maxFiles()],
            'images.*' => ['image', "max:{$imageMax}"],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/quicktime,video/webm', 'max:'.MediaCollection::Video->maxSizeKilobytes()],
            'remove_video' => ['boolean'],
            'removed_media_ids' => ['array'],
            'removed_media_ids.*' => ['integer'],
        ];
    }

    /**
     * The persistable column values for the product itself.
     *
     * @return array<string, mixed>
     */
    public function productAttributes(): array
    {
        return [
            'name' => $this->validated('name'),
            'sku' => $this->validated('sku'),
            'category_id' => $this->validated('category_id'),
            'packaging_type_id' => $this->validated('packaging_type_id'),
            'description' => $this->validated('description'),
            'weight' => $this->validated('weight'),
            'sales_unit' => $this->validated('sales_unit'),
            'order_mode' => $this->validated('order_mode'),
            'is_special_offer' => $this->boolean('is_special_offer'),
            'is_active' => $this->boolean('is_active'),
            'price' => $this->validated('price'),
            'stock' => $this->validated('stock'),
            'discount_percent' => $this->validated('discount_percent'),
        ];
    }
}
