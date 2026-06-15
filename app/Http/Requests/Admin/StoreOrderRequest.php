<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\BuildsOrderRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    use BuildsOrderRules;

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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(
            ['user_id' => ['required', 'integer', 'exists:users,id']],
            $this->orderRules((int) $this->integer('user_id')),
        );
    }
}
