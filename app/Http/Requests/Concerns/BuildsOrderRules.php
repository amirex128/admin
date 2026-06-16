<?php

namespace App\Http\Requests\Concerns;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\SalesUnit;
use App\Enums\ShippingMethod;
use Illuminate\Validation\Rule;

/**
 * Shared validation rules for creating orders, used by both the seller and
 * admin order requests.
 */
trait BuildsOrderRules
{
    /**
     * The rules describing the order header and its line items.
     *
     * @param  int  $ownerId  The seller whose products the line items must belong to.
     * @return array<string, mixed>
     */
    protected function orderRules(int $ownerId): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'shipping_method' => ['nullable', Rule::enum(ShippingMethod::class)],
            'payment_method' => ['nullable', Rule::enum(OrderPaymentMethod::class)],
            'tracking_code' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(OrderStatus::class)->only([OrderStatus::Proforma, OrderStatus::AwaitingConfirmation])],
            'payment_status' => ['nullable', Rule::enum(OrderPaymentStatus::class)],
            // Tax is always derived from the store's main VAT percent in settings;
            // it is never supplied by the manual order form.
            'shipping_cost' => ['nullable', 'integer', 'min:0', 'max:100000000000'],
            'note' => ['nullable', 'string', 'max:2000'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', Rule::exists('products', 'id')->where('user_id', $ownerId)],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.sales_unit' => ['nullable', Rule::enum(SalesUnit::class)],
            'items.*.unit_price' => ['required', 'integer', 'min:0', 'max:100000000000'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'items.*.discount_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
