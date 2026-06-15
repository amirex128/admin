<?php

namespace App\Http\Resources;

use App\Enums\MediaCollection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'sku' => $this->sku,
            'description' => $this->description,
            'weight' => $this->weight,
            'sales_unit' => $this->sales_unit->value,
            'sales_unit_label' => $this->sales_unit->label(),
            'is_special_offer' => $this->is_special_offer,
            'order_mode' => $this->order_mode->value,
            'order_mode_label' => $this->order_mode->label(),
            'is_active' => $this->is_active,
            'approval_status' => $this->approval_status->value,
            'approval_status_label' => $this->approval_status->label(),
            'approval_status_color' => $this->approval_status->color(),
            'rejection_reason' => $this->rejection_reason,
            'price' => $this->price,
            'discounted_price' => $this->discountedPrice(),
            'stock' => $this->stock,
            'discount_percent' => $this->discount_percent,
            'variation_attributes' => $this->variation_attributes,
            'sort_order' => $this->sort_order,
            'category_id' => $this->category_id,
            'packaging_type_id' => $this->packaging_type_id,
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'packaging_type' => PackagingTypeResource::make($this->whenLoaded('packagingType')),
            'owner' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'images' => $this->mediaIn(MediaCollection::Image),
            'video' => $this->mediaIn(MediaCollection::Video)->first(),
            'attributes' => $this->whenLoaded('attributes', fn () => $this->attributes->map(fn ($attribute) => [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'values' => $attribute->relationLoaded('values')
                    ? $attribute->values->map(fn ($value) => ['id' => $value->id, 'value' => $value->value])->values()
                    : [],
            ])->values()),
            'variations' => ProductResource::collection($this->whenLoaded('variations')),
            'variations_count' => $this->whenCounted('variations'),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    /**
     * The loaded media records for a given collection as resource arrays.
     *
     * @return Collection<int, array<string, mixed>>
     */
    protected function mediaIn(MediaCollection $collection)
    {
        if (! $this->relationLoaded('media')) {
            return collect();
        }

        return $this->media
            ->filter(fn ($media) => $media->collection === $collection)
            ->map(fn ($media) => MediaResource::make($media)->resolve())
            ->values();
    }
}
