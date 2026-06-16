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

        $targetUser = $this->route('user') ?: $this->user();
        $settingId = optional($targetUser?->storeSetting)->id;

        return [
            'persian_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'store_phone' => ['nullable', 'string', 'max:30'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            'socials' => ['nullable', 'array'],
            'socials.telegram' => ['nullable', 'string', 'max:255'],
            'socials.whatsapp' => ['nullable', 'string', 'max:255'],
            'socials.instagram' => ['nullable', 'string', 'max:255'],
            'socials.eitaa' => ['nullable', 'string', 'max:255'],
            'socials.rubika' => ['nullable', 'string', 'max:255'],
            'socials.bale' => ['nullable', 'string', 'max:255'],

            'about_us' => ['nullable', 'string', 'max:65535'],
            'buying_guide' => ['nullable', 'string', 'max:65535'],
            'return_policy' => ['nullable', 'string', 'max:65535'],
            'terms' => ['nullable', 'string', 'max:65535'],

            'faqs' => ['nullable', 'array'],
            'faqs.*.question' => ['required', 'string', 'max:500'],
            'faqs.*.answer' => ['required', 'string', 'max:5000'],

            'badges' => ['nullable', 'array'],
            'badges.*.title' => ['required', 'string', 'max:255'],
            'badges.*.description' => ['nullable', 'string', 'max:1000'],
            'badges.*.html' => ['nullable', 'string', 'max:5000'],
            'badges.*.enabled' => ['boolean'],

            'subdomain' => [
                'nullable', 'string', 'max:63', 'regex:/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/',
                Rule::unique('store_settings', 'subdomain')->ignore($settingId),
            ],
            'custom_domain' => [
                'nullable', 'string', 'max:255', 'regex:/^[a-z0-9.-]+\.[a-z]{2,}$/',
                Rule::unique('store_settings', 'custom_domain')->ignore($settingId),
            ],
            'template' => ['nullable', 'string', 'max:50'],

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
            'zarinpal_merchant_id' => [
                Rule::requiredIf(fn (): bool => $this->boolean('zarinpal_enabled')),
                'nullable', 'string', 'max:255',
            ],
            'zarinpal_access_token' => [
                Rule::requiredIf(fn (): bool => $this->boolean('zarinpal_enabled')),
                'nullable', 'string', 'max:255',
            ],

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
     * Custom Persian validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'zarinpal_merchant_id.required' => 'برای فعال‌سازی درگاه اختصاصی زرین‌پال، وارد کردن مرچنت کد الزامی است.',
            'zarinpal_access_token.required' => 'برای فعال‌سازی درگاه اختصاصی زرین‌پال، وارد کردن توکن دسترسی الزامی است.',
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

        // Derive the domain connection status: subdomains are instant on our
        // infrastructure, custom domains require DNS verification first.
        $targetUser = $this->route('user') ?: $this->user();
        $current = optional($targetUser?->storeSetting)->domain_status ?? 'none';

        if ($this->filled('custom_domain')) {
            $data['domain_status'] = $current === 'connected' ? 'connected' : 'pending';
        } elseif ($this->filled('subdomain')) {
            $data['domain_status'] = 'connected';
        } else {
            $data['domain_status'] = 'none';
        }

        return $data;
    }
}
