<?php

namespace App\Http\Resources;

use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin WalletTransaction
 */
class WalletTransactionResource extends JsonResource
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
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'reason' => $this->reason->value,
            'reason_label' => $this->reason->label(),
            'amount' => $this->amount,
            'signed_amount' => $this->type->sign() * $this->amount,
            'balance_after' => $this->balance_after,
            'description' => $this->description,
            'performed_by' => $this->whenLoaded('performer', fn () => $this->performer?->name),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
