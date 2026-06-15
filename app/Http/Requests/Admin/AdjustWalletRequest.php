<?php

namespace App\Http\Requests\Admin;

use App\Enums\WalletTransactionType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdjustWalletRequest extends FormRequest
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
            'type' => ['required', Rule::enum(WalletTransactionType::class)],
            'amount' => ['required', 'integer', 'min:1', 'max:1000000000'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * The signed amount where a debit is negative.
     */
    public function signedAmount(): int
    {
        $type = WalletTransactionType::from($this->validated('type'));

        return $type->sign() * (int) $this->validated('amount');
    }
}
