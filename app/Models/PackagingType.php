<?php

namespace App\Models;

use Database\Factories\PackagingTypeFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class PackagingType extends Model
{
    /** @use HasFactory<PackagingTypeFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
    ];

    /**
     * The user that owns the packaging type.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The products that use this packaging type.
     *
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope a query to packaging types owned by the given user.
     *
     * @param  Builder<PackagingType>  $query
     */
    public function scopeOwnedBy(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }
}
