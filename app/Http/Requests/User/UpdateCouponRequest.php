<?php

namespace App\Http\Requests\User;

use App\Http\Requests\Concerns\BuildsCouponRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCouponRequest extends FormRequest
{
    use BuildsCouponRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('coupon')) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->couponRules($this->user()->id, $this->route('coupon')->id);
    }
}
