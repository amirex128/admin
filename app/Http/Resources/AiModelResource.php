<?php

namespace App\Http\Resources;

use App\Models\AiModel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AiModel
 */
class AiModelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'provider' => $this->provider,
            'model_identifier' => $this->model_identifier,
            'description' => $this->description,
            'price_per_1k_tokens' => $this->price_per_1k_tokens,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'users_count' => $this->whenCounted('users'),
        ];
    }
}
