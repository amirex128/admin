<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    /**
     * Administrators may manage every customer.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any customers.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the customer.
     */
    public function view(User $user, Customer $customer): bool
    {
        return $this->owns($user, $customer);
    }

    /**
     * Determine whether the user can create customers.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the customer.
     */
    public function update(User $user, Customer $customer): bool
    {
        return $this->owns($user, $customer);
    }

    /**
     * Determine whether the user can delete the customer.
     */
    public function delete(User $user, Customer $customer): bool
    {
        return $this->owns($user, $customer);
    }

    /**
     * Whether the user owns the given customer.
     */
    protected function owns(User $user, Customer $customer): bool
    {
        return $customer->user_id === $user->id;
    }
}
