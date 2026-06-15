<?php

namespace App\Http\Resources;

use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin StoreSetting
 */
class StoreSettingResource extends JsonResource
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
            'province_id' => $this->province_id,
            'city_id' => $this->city_id,
            'card_to_card_enabled' => $this->card_to_card_enabled,
            'card_holder_name' => $this->card_holder_name,
            'card_number' => $this->card_number,
            'sheba_number' => $this->sheba_number,
            'zarinpal_enabled' => $this->zarinpal_enabled,
            'zarinpal_merchant_id' => $this->zarinpal_merchant_id,
            'zarinpal_access_token' => $this->zarinpal_access_token,
            'vat_percent' => $this->vat_percent,
            'refund_window_minutes' => $this->refund_window_minutes,
            'shipping_methods' => (object) ($this->shipping_methods ?? []),
            'intra_city_days' => $this->intra_city_days,
            'inter_city_days' => $this->inter_city_days,
        ];
    }
}
