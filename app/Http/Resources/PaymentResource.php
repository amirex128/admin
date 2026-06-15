<?php

namespace App\Http\Resources;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Payment
 */
class PaymentResource extends JsonResource
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
            'amount' => $this->amount,
            'authority' => $this->authority,
            'ref_id' => $this->ref_id,
            'card_pan' => $this->card_pan,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'description' => $this->description,
            'is_reversible' => $this->isReversible(),
            'is_refundable' => $this->isRefundable(),
            'paid_at' => $this->paid_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'phone' => $this->user->phone,
            ]),
        ];
    }
}
