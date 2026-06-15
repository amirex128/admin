<?php

namespace App\Models;

use App\Enums\DiscountType;
use Database\Factories\CouponFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * A discount coupon owned by a seller. It can target all products or a specific
 * set, and is valid within an optional (Jalali-picked) date window.
 *
 * @property int $id
 * @property int $user_id
 * @property string $code
 * @property DiscountType $type
 * @property int $value
 * @property int|null $min_order_amount
 * @property int|null $max_discount_amount
 * @property int|null $usage_limit
 * @property int $used_count
 * @property bool $applies_to_all
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Coupon extends Model
{
    /** @use HasFactory<CouponFactory> */
    use HasFactory;

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'type' => DiscountType::Percentage->value,
        'value' => 0,
        'used_count' => 0,
        'applies_to_all' => true,
        'is_active' => true,
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_discount_amount',
        'usage_limit',
        'used_count',
        'applies_to_all',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => DiscountType::class,
            'value' => 'integer',
            'min_order_amount' => 'integer',
            'max_discount_amount' => 'integer',
            'usage_limit' => 'integer',
            'used_count' => 'integer',
            'applies_to_all' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The seller that owns the coupon.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The products the coupon is restricted to (when not applying to all).
     *
     * @return BelongsToMany<Product, $this>
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    /**
     * Restrict the query to coupons owned by the given user.
     *
     * @param  Builder<Coupon>  $query
     */
    public function scopeOwnedBy(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }

    /**
     * Whether the coupon is active and within its validity window and usage cap.
     */
    public function isCurrentlyValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->starts_at !== null && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->ends_at !== null && $this->ends_at->isPast()) {
            return false;
        }

        return $this->usage_limit === null || $this->used_count < $this->usage_limit;
    }

    /**
     * Calculate the discount amount (in Toman) for a given subtotal.
     */
    public function discountFor(int $subtotal): int
    {
        if ($this->min_order_amount !== null && $subtotal < $this->min_order_amount) {
            return 0;
        }

        $discount = $this->type === DiscountType::Percentage
            ? (int) round($subtotal * min(100, max(0, $this->value)) / 100)
            : $this->value;

        if ($this->max_discount_amount !== null) {
            $discount = min($discount, $this->max_discount_amount);
        }

        return max(0, min($discount, $subtotal));
    }
}
