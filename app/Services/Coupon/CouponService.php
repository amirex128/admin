<?php

namespace App\Services\Coupon;

use App\Models\Coupon;
use App\Models\User;
use Illuminate\Support\Arr;

/**
 * Persists coupons and synchronises their targeted products, shared by the
 * create and update flows.
 */
class CouponService
{
    /**
     * Create or update a coupon for the owner and sync targeted products.
     *
     * @param  array<string, mixed>  $data
     */
    public function persist(User $owner, array $data, ?Coupon $coupon = null): Coupon
    {
        $attributes = Arr::except($data, ['product_ids']);

        if ($coupon === null) {
            $coupon = $owner->coupons()->create($attributes);
        } else {
            $coupon->update($attributes);
        }

        $productIds = ($data['applies_to_all'] ?? false)
            ? []
            : array_map('intval', $data['product_ids'] ?? []);

        $coupon->products()->sync($productIds);

        return $coupon;
    }
}
