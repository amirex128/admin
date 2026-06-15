<?php

namespace App\Http\Controllers\Concerns;

use App\Http\Resources\StoreSettingResource;
use App\Models\City;
use App\Models\Province;
use App\Models\User;
use App\Services\Store\StoreSettingService;
use Illuminate\Http\Request;

/**
 * Shared Inertia props for the store settings screen, reused by the seller
 * panel and the admin user hub so the UI stays DRY.
 */
trait BuildsStoreSettingProps
{
    /**
     * @return array<string, mixed>
     */
    protected function storeSettingProps(User $user, Request $request, StoreSettingService $service): array
    {
        $settings = $service->forUser($user);

        $provinceId = $request->integer('province_id') ?: $settings->province_id;

        $cities = $provinceId
            ? City::query()->where('province_id', $provinceId)->orderBy('name')->get(['id', 'name'])
            : collect();

        return [
            'settings' => StoreSettingResource::make($settings)->resolve(),
            'provinces' => Province::query()->orderBy('name')->get(['id', 'name'])
                ->map(fn (Province $province) => ['id' => $province->id, 'name' => $province->name])->all(),
            'cities' => $cities->map(fn (City $city) => ['id' => $city->id, 'name' => $city->name])->all(),
            'shippingMethods' => StoreSettingService::SHIPPING_METHODS,
        ];
    }
}
