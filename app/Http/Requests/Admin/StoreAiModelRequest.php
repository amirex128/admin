<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Laravel\Ai\Enums\Lab;

class StoreAiModelRequest extends FormRequest
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
            'provider' => ['required', Rule::enum(Lab::class)],
            'model_identifier' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'price_per_1k_tokens' => ['required', 'integer', 'min:0', 'max:100000000'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }

    /**
     * The persistable attributes for the AI model.
     *
     * @return array<string, mixed>
     */
    public function modelAttributes(): array
    {
        $data = $this->validated();
        $data['is_active'] = $this->boolean('is_active');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }
}
