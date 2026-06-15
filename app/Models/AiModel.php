<?php

namespace App\Models;

use Database\Factories\AiModelFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Laravel\Ai\Enums\Lab;

/**
 * @property int $id
 * @property string $name
 * @property string $provider
 * @property string $model_identifier
 * @property string|null $description
 * @property int $price_per_1k_tokens
 * @property bool $is_active
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class AiModel extends Model
{
    /** @use HasFactory<AiModelFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'provider',
        'model_identifier',
        'description',
        'price_per_1k_tokens',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_per_1k_tokens' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * The users that have selected this model as their default.
     *
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'ai_model_id');
    }

    /**
     * Resolve the underlying provider as a Laravel AI SDK lab enum.
     */
    public function lab(): Lab
    {
        return Lab::from($this->provider);
    }

    /**
     * The cost, in Toman, of consuming the given number of tokens.
     */
    public function costForTokens(int $tokens): int
    {
        return (int) ceil($tokens / 1000 * $this->price_per_1k_tokens);
    }

    /**
     * Scope a query to only include active models.
     *
     * @param  Builder<AiModel>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
