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
            'persian_name' => $this->persian_name,
            'business_type' => $this->business_type,
            'store_phone' => $this->store_phone,
            'province_id' => $this->province_id,
            'city_id' => $this->city_id,
            'postal_code' => $this->postal_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'socials' => (object) ($this->socials ?? []),
            'about_us' => $this->about_us,
            'buying_guide' => $this->buying_guide,
            'return_policy' => $this->return_policy,
            'terms' => $this->terms,
            'faqs' => $this->faqs ?? [],
            'badges' => $this->badges ?? [],
            'subdomain' => $this->subdomain,
            'custom_domain' => $this->custom_domain,
            'domain_status' => $this->domain_status,
            'template' => $this->template,
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
