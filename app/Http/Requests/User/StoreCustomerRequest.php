<?php

namespace App\Http\Requests\User;

use App\Http\Requests\Concerns\BuildsCustomerRules;
use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    use BuildsCustomerRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Customer::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->customerRules();
    }
}
