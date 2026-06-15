<?php

namespace App\Http\Requests\User;

use App\Models\Product;

class StoreProductRequest extends ProductRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Product::class) ?? false;
    }
}
