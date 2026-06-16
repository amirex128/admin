<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
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
            'code' => $this->code,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'payment_status' => $this->payment_status->value,
            'payment_status_label' => $this->payment_status->label(),
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'province' => $this->province,
            'city' => $this->city,
            'address' => $this->address,
            'shipping_method' => $this->shipping_method?->value,
            'shipping_method_label' => $this->shipping_method?->label(),
            'payment_method' => $this->payment_method?->value,
            'payment_method_label' => $this->payment_method?->label(),
            'tracking_code' => $this->tracking_code,
            'subtotal' => $this->subtotal,
            'tax_percent' => $this->tax_percent,
            'tax_amount' => $this->tax_amount,
            'shipping_cost' => $this->shipping_cost,
            'total' => $this->total,
            'note' => $this->note,
            'items_count' => $this->whenCounted('items'),
            'shipped_at' => $this->shipped_at?->toISOString(),
            'delivered_at' => $this->delivered_at?->toISOString(),
            'paid_at' => $this->paid_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'items' => $this->whenLoaded('items', fn () => OrderItemResource::collection($this->items)->resolve()),
            'histories' => $this->whenLoaded('statusHistories', fn () => $this->statusHistories->map(fn ($history) => [
                'id' => $history->id,
                'status' => $history->status->value,
                'status_label' => $history->status->label(),
                'note' => $history->note,
                'created_at' => $history->created_at?->toISOString(),
            ])->values()),
            'owner' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'phone' => $this->user->phone,
            ]),
        ];
    }
}
