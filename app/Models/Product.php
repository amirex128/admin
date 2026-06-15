<?php

namespace App\Models;

use App\Enums\OrderMode;
use App\Enums\ProductApprovalStatus;
use App\Enums\SalesUnit;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $parent_id
 * @property int|null $category_id
 * @property int|null $packaging_type_id
 * @property string $name
 * @property string|null $sku
 * @property string|null $description
 * @property int|null $weight
 * @property SalesUnit $sales_unit
 * @property bool $is_special_offer
 * @property OrderMode $order_mode
 * @property bool $is_active
 * @property ProductApprovalStatus $approval_status
 * @property string|null $rejection_reason
 * @property Carbon|null $reviewed_at
 * @property int $price
 * @property int $stock
 * @property int|null $discount_percent
 * @property array<string, string>|null $variation_attributes
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'approval_status' => ProductApprovalStatus::Pending->value,
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'parent_id',
        'category_id',
        'packaging_type_id',
        'name',
        'sku',
        'description',
        'weight',
        'sales_unit',
        'is_special_offer',
        'order_mode',
        'is_active',
        'approval_status',
        'rejection_reason',
        'reviewed_at',
        'price',
        'stock',
        'discount_percent',
        'variation_attributes',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'weight' => 'integer',
            'sales_unit' => SalesUnit::class,
            'is_special_offer' => 'boolean',
            'order_mode' => OrderMode::class,
            'is_active' => 'boolean',
            'approval_status' => ProductApprovalStatus::class,
            'reviewed_at' => 'datetime',
            'price' => 'integer',
            'stock' => 'integer',
            'discount_percent' => 'integer',
            'variation_attributes' => 'array',
            'sort_order' => 'integer',
        ];
    }

    /**
     * The user that owns the product.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The parent product when this row is a variation.
     *
     * @return BelongsTo<Product, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * The variations stored as separate products under this one.
     *
     * @return HasMany<Product, $this>
     */
    public function variations(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<PackagingType, $this>
     */
    public function packagingType(): BelongsTo
    {
        return $this->belongsTo(PackagingType::class);
    }

    /**
     * The customizable attributes (e.g. color, warranty) defined for the product.
     *
     * @return HasMany<ProductAttribute, $this>
     */
    public function attributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }

    /**
     * All media attached to the product across every collection.
     *
     * @return MorphMany<Media, $this>
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable')->orderBy('sort_order');
    }

    /**
     * The price after applying the discount percentage, in Toman.
     */
    public function discountedPrice(): int
    {
        if ($this->discount_percent === null || $this->discount_percent <= 0) {
            return $this->price;
        }

        return (int) round($this->price * (100 - $this->discount_percent) / 100);
    }

    /**
     * Whether this product is a variation of another product.
     */
    public function isVariation(): bool
    {
        return $this->parent_id !== null;
    }

    /**
     * Whether the product has been approved by an administrator.
     */
    public function isApproved(): bool
    {
        return $this->approval_status === ProductApprovalStatus::Approved;
    }

    /**
     * Scope a query to products with the given approval status.
     *
     * @param  Builder<Product>  $query
     */
    public function scopeWithApproval(Builder $query, ProductApprovalStatus $status): void
    {
        $query->where('approval_status', $status);
    }

    /**
     * Scope a query to root (non variation) products.
     *
     * @param  Builder<Product>  $query
     */
    public function scopeRoots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * Scope a query to products owned by the given user.
     *
     * @param  Builder<Product>  $query
     */
    public function scopeOwnedBy(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }
}
