<?php

namespace App\Http\Resources;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItem
 */
class OrderItemResource extends JsonResource
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
            'product_id' => $this->product_id,
            'name' => $this->name,
            'sales_unit' => $this->sales_unit?->value,
            'sales_unit_label' => $this->sales_unit?->label(),
            'unit_price' => $this->unit_price,
            'quantity' => $this->quantity,
            'discount_percent' => $this->discount_percent,
            'total' => $this->total,
        ];
    }
}
