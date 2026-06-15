<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Administrators may manage every product.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any products.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the product.
     */
    public function view(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }

    /**
     * Determine whether the user can create products.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the product.
     */
    public function update(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }

    /**
     * Determine whether the user can delete the product.
     */
    public function delete(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }

    /**
     * Determine whether the user can duplicate the product.
     */
    public function duplicate(User $user, Product $product): bool
    {
        return $this->owns($user, $product);
    }

    /**
     * Whether the user owns the given product.
     */
    protected function owns(User $user, Product $product): bool
    {
        return $product->user_id === $user->id;
    }
}
