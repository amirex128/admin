<?php

namespace App\Services\Store;

use App\Models\StoreSetting;
use App\Models\User;

/**
 * Resolves and updates a seller's store configuration and derives shipping
 * costs from it.
 */
class StoreSettingService
{
    /**
     * Default per-method shipping configuration.
     *
     * @var array<int, string>
     */
    public const SHIPPING_METHODS = ['tipax', 'post', 'courier'];

    /**
     * Get the user's store settings, creating defaults on first access.
     */
    public function forUser(User $user): StoreSetting
    {
        return $user->storeSetting()->firstOrCreate([]);
    }

    /**
     * Persist the validated settings payload.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(StoreSetting $settings, array $data): StoreSetting
    {
        $settings->fill($data);
        $settings->save();

        return $settings;
    }

    /**
     * Resolve the shipping cost for a method given whether the destination is
     * inside the store's own city.
     */
    public function shippingCost(StoreSetting $settings, string $method, bool $isIntraCity): int
    {
        $config = $settings->shipping_methods[$method] ?? null;

        if (! is_array($config) || ! ($config['enabled'] ?? false)) {
            return 0;
        }

        $key = $isIntraCity ? 'intra_cost' : 'inter_cost';

        return (int) ($config[$key] ?? 0);
    }

    /**
     * The promised delivery time (working days) for the destination.
     */
    public function deliveryDays(StoreSetting $settings, bool $isIntraCity): int
    {
        return $isIntraCity ? $settings->intra_city_days : $settings->inter_city_days;
    }

    /**
     * Whether the given destination city is the store's own city.
     */
    public function isIntraCity(StoreSetting $settings, ?int $destinationCityId): bool
    {
        return $settings->city_id !== null
            && $destinationCityId !== null
            && $settings->city_id === $destinationCityId;
    }
}
