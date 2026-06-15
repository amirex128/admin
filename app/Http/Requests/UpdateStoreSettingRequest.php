<?php

namespace App\Http\Requests;

use App\Services\Store\StoreSettingService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Shared validation for updating a store's settings from both the seller panel
 * and the admin user hub. Access is gated by route middleware (auth vs admin).
 */
class UpdateStoreSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $methods = StoreSettingService::SHIPPING_METHODS;

        return [
            'province_id' => ['nullable', 'integer', 'exists:provinces,id'],
            'city_id' => ['nullable', 'integer', Rule::exists('cities', 'id')->where(function ($query) {
                if ($this->filled('province_id')) {
                    $query->where('province_id', $this->integer('province_id'));
                }
            })],

            'card_to_card_enabled' => ['boolean'],
            'card_holder_name' => ['nullable', 'string', 'max:255'],
            'card_number' => ['nullable', 'string', 'max:32'],
            'sheba_number' => ['nullable', 'string', 'max:34'],

            'zarinpal_enabled' => ['boolean'],
            'zarinpal_merchant_id' => ['nullable', 'string', 'max:255'],
            'zarinpal_access_token' => ['nullable', 'string', 'max:255'],

            'vat_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'refund_window_minutes' => ['nullable', 'integer', 'min:0', 'max:1440'],

            'intra_city_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'inter_city_days' => ['nullable', 'integer', 'min:0', 'max:365'],

            'shipping_methods' => ['nullable', 'array'],
            ...collect($methods)->mapWithKeys(fn (string $method) => [
                "shipping_methods.{$method}.enabled" => ['boolean'],
                "shipping_methods.{$method}.intra_cost" => ['nullable', 'integer', 'min:0', 'max:100000000000'],
                "shipping_methods.{$method}.inter_cost" => ['nullable', 'integer', 'min:0', 'max:100000000000'],
            ])->all(),
        ];
    }

    /**
     * The validated settings payload ready to persist.
     *
     * @return array<string, mixed>
     */
    public function settingsData(): array
    {
        $data = $this->validated();

        // Booleans default to false when the toggle is omitted.
        foreach (['card_to_card_enabled', 'zarinpal_enabled'] as $flag) {
            $data[$flag] = $this->boolean($flag);
        }

        return $data;
    }
}
