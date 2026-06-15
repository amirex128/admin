<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'integer', 'min:0', 'max:1000000000'],
            'billing_period' => ['required', Rule::in(['monthly', 'quarterly', 'yearly', 'lifetime'])],
            'duration_days' => ['required', 'integer', 'min:1', 'max:36500'],
            'features' => ['nullable', 'array'],
            'features.*' => ['required', 'string', 'max:255'],
            'discount_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'discount_badge' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }

    /**
     * Get the validated payload ready to persist, including a generated slug.
     *
     * @return array<string, mixed>
     */
    public function planAttributes(): array
    {
        $data = $this->validated();
        $data['slug'] = Str::slug($data['name']).'-'.Str::lower(Str::random(6));
        $data['features'] = array_values($data['features'] ?? []);

        return $data;
    }
}
