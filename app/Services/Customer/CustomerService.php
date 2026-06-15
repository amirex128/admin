<?php

namespace App\Services\Customer;

use App\Enums\CustomerStatus;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * Shared customer (CRM) operations used by both the seller and admin panels:
 * list filtering and the automatic upsert performed when an order is created.
 */
class CustomerService
{
    /**
     * Apply the supported list filters (search term and status) to the query.
     *
     * @param  Builder<Customer>  $query
     * @param  array<string, mixed>  $filters
     * @return Builder<Customer>
     */
    public function applyFilters(Builder $query, array $filters): Builder
    {
        $search = trim((string) ($filters['search'] ?? ''));

        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('national_code', 'like', "%{$search}%");
            });
        }

        $status = CustomerStatus::tryFrom((string) ($filters['status'] ?? ''));

        if ($status instanceof CustomerStatus) {
            $query->withStatus($status);
        }

        return $query;
    }

    /**
     * Find an existing customer for the order owner (matched by phone, falling
     * back to name) or create one. Newly provided contact details backfill any
     * blanks without overwriting existing values or the block status.
     *
     * @param  array<string, mixed>  $data
     */
    public function findOrCreateForOrder(User $owner, array $data): Customer
    {
        $name = trim((string) ($data['customer_name'] ?? ''));
        $phone = trim((string) ($data['customer_phone'] ?? ''));

        $customer = $this->matchExisting($owner, $phone, $name);

        if ($customer === null) {
            return $owner->customers()->create([
                'name' => $name !== '' ? $name : 'مشتری',
                'phone' => $phone !== '' ? $phone : null,
                'province' => $this->nullableString($data['province'] ?? null),
                'city' => $this->nullableString($data['city'] ?? null),
                'address' => $this->nullableString($data['address'] ?? null),
            ]);
        }

        $this->backfill($customer, $data);

        return $customer;
    }

    /**
     * Locate an existing customer by phone, then by name.
     */
    protected function matchExisting(User $owner, string $phone, string $name): ?Customer
    {
        if ($phone !== '') {
            $byPhone = $owner->customers()->where('phone', $phone)->first();

            if ($byPhone !== null) {
                return $byPhone;
            }
        }

        if ($name !== '') {
            return $owner->customers()->whereNull('phone')->where('name', $name)->first();
        }

        return null;
    }

    /**
     * Fill any blank contact details on an existing customer from order data.
     *
     * @param  array<string, mixed>  $data
     */
    protected function backfill(Customer $customer, array $data): void
    {
        $updates = [];

        foreach (['province' => 'province', 'city' => 'city', 'address' => 'address'] as $orderKey => $column) {
            $value = $this->nullableString($data[$orderKey] ?? null);

            if ($value !== null && ($customer->{$column} === null || $customer->{$column} === '')) {
                $updates[$column] = $value;
            }
        }

        if ($updates !== []) {
            $customer->update($updates);
        }
    }

    /**
     * Normalize a raw value to a trimmed string or null.
     */
    protected function nullableString(mixed $value): ?string
    {
        $value = trim((string) ($value ?? ''));

        return $value !== '' ? $value : null;
    }
}
