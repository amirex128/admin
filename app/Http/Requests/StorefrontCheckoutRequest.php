<?php

namespace App\Http\Requests;

use App\Enums\OrderPaymentMethod;
use App\Enums\ShippingMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorefrontCheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'province_id' => ['nullable', 'integer', 'exists:provinces,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'address' => ['nullable', 'string', 'max:1000'],
            'shipping_method' => ['nullable', Rule::enum(ShippingMethod::class)],
            'payment_method' => [
                'required',
                Rule::enum(OrderPaymentMethod::class)->only([
                    OrderPaymentMethod::Online,
                    OrderPaymentMethod::CashOnDelivery,
                    OrderPaymentMethod::BankTransfer,
                ]),
            ],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
        ];
    }
}
