<?php

namespace App\Http\Requests\User;

use App\Http\Requests\Concerns\BuildsCouponRules;
use App\Models\Coupon;
use Illuminate\Foundation\Http\FormRequest;

class StoreCouponRequest extends FormRequest
{
    use BuildsCouponRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Coupon::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->couponRules($this->user()->id);
    }
}
