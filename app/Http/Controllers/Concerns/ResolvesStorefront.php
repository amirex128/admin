<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Category;
use App\Models\StoreSetting;
use Illuminate\Support\Facades\Auth;

/**
 * Shared storefront resolution and presentation props for the public store
 * controllers (catalog, auth, account).
 */
trait ResolvesStorefront
{
    /**
     * Resolve a store by its subdomain or custom domain.
     */
    protected function resolveStore(string $store): StoreSetting
    {
        return StoreSetting::query()
            ->with('user')
            ->where(fn ($q) => $q->where('subdomain', $store)->orWhere('custom_domain', $store))
            ->firstOrFail();
    }

    /**
     * The shared store identity / navigation / footer props plus the currently
     * authenticated storefront customer (if they belong to this store).
     *
     * @return array<string, mixed>
     */
    protected function storeProps(StoreSetting $settings): array
    {
        $owner = $settings->user;
        $key = $settings->subdomain ?: $settings->custom_domain;

        $categories = Category::query()->where('user_id', $owner->id)->whereNull('parent_id')
            ->orderBy('name')->get(['id', 'name'])
            ->map(fn (Category $c) => ['id' => $c->id, 'name' => $c->name])->all();

        $badges = collect($settings->badges ?? [])
            ->filter(fn (array $badge) => ($badge['enabled'] ?? false))
            ->values()->all();

        $customer = Auth::guard('customer')->user();
        $authCustomer = ($customer !== null && $customer->user_id === $settings->user_id)
            ? ['id' => $customer->id, 'name' => $customer->name]
            : null;

        return [
            'key' => $key,
            'name' => $settings->persian_name ?: $owner->name,
            'business_type' => $settings->business_type,
            'phone' => $settings->store_phone,
            'address' => trim((string) ($settings->postal_code ?? '')),
            'socials' => (object) ($settings->socials ?? []),
            'badges' => $badges,
            'categories' => $categories,
            'customer' => $authCustomer,
            'pages' => [
                'about' => filled($settings->about_us),
                'buying-guide' => filled($settings->buying_guide),
                'return-policy' => filled($settings->return_policy),
                'terms' => filled($settings->terms),
                'faq' => ! empty($settings->faqs),
            ],
        ];
    }
}
