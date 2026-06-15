<?php

namespace App\Http\Requests\Concerns;

use App\Enums\CustomerStatus;
use Illuminate\Validation\Rule;

/**
 * Shared validation rules for creating and updating CRM customers, used by both
 * the seller and admin requests.
 */
trait BuildsCustomerRules
{
    /**
     * The rules describing a customer record.
     *
     * @return array<string, mixed>
     */
    protected function customerRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'national_code' => ['nullable', 'string', 'max:20'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', Rule::enum(CustomerStatus::class)],
            'note' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
