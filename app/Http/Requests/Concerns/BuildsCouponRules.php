<?php

namespace App\Http\Requests\Concerns;

use App\Enums\DiscountType;
use Illuminate\Validation\Rule;

/**
 * Shared validation rules for creating and updating discount coupons.
 */
trait BuildsCouponRules
{
    /**
     * @return array<string, mixed>
     */
    protected function couponRules(int $ownerId, ?int $couponId = null): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('coupons', 'code')->where('user_id', $ownerId)->ignore($couponId),
            ],
            'type' => ['required', Rule::enum(DiscountType::class)],
            'value' => ['required', 'integer', 'min:0', 'max:100000000000'],
            'min_order_amount' => ['nullable', 'integer', 'min:0', 'max:100000000000'],
            'max_discount_amount' => ['nullable', 'integer', 'min:0', 'max:100000000000'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'applies_to_all' => ['required', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', Rule::exists('products', 'id')->where('user_id', $ownerId)],
        ];
    }
}
