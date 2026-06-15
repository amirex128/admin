<?php

namespace App\Policies;

use App\Models\Coupon;
use App\Models\User;

class CouponPolicy
{
    /**
     * Administrators may manage every coupon.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any coupons.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create coupons.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the coupon.
     */
    public function update(User $user, Coupon $coupon): bool
    {
        return $this->owns($user, $coupon);
    }

    /**
     * Determine whether the user can delete the coupon.
     */
    public function delete(User $user, Coupon $coupon): bool
    {
        return $this->owns($user, $coupon);
    }

    /**
     * Whether the user owns the given coupon.
     */
    protected function owns(User $user, Coupon $coupon): bool
    {
        return $coupon->user_id === $user->id;
    }
}
