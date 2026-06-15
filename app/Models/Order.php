<?php

namespace App\Models;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\ShippingMethod;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $customer_id
 * @property string $code
 * @property OrderStatus $status
 * @property OrderPaymentStatus $payment_status
 * @property string $customer_name
 * @property string|null $customer_phone
 * @property string|null $province
 * @property string|null $city
 * @property string|null $address
 * @property ShippingMethod|null $shipping_method
 * @property OrderPaymentMethod|null $payment_method
 * @property string|null $tracking_code
 * @property int $subtotal
 * @property int $tax_percent
 * @property int $tax_amount
 * @property int $shipping_cost
 * @property int $total
 * @property string|null $note
 * @property Carbon|null $shipped_at
 * @property Carbon|null $delivered_at
 * @property Carbon|null $paid_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'customer_id',
        'code',
        'status',
        'payment_status',
        'customer_name',
        'customer_phone',
        'province',
        'city',
        'address',
        'shipping_method',
        'payment_method',
        'tracking_code',
        'subtotal',
        'tax_percent',
        'tax_amount',
        'shipping_cost',
        'total',
        'note',
        'shipped_at',
        'delivered_at',
        'paid_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => OrderPaymentStatus::class,
            'shipping_method' => ShippingMethod::class,
            'payment_method' => OrderPaymentMethod::class,
            'subtotal' => 'integer',
            'tax_percent' => 'integer',
            'tax_amount' => 'integer',
            'shipping_cost' => 'integer',
            'total' => 'integer',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * The seller who owns the order.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The CRM customer who placed the order, if linked.
     *
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * The line items of the order.
     *
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * The chronological status changes recorded for the order.
     *
     * @return HasMany<OrderStatusHistory, $this>
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    /**
     * Restrict the query to orders owned by the given user.
     *
     * @param  Builder<Order>  $query
     */
    public function scopeOwnedBy(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }

    /**
     * Restrict the query to orders with the given status.
     *
     * @param  Builder<Order>  $query
     */
    public function scopeWithStatus(Builder $query, OrderStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Whether the order is still a (downloadable) pre-invoice / proforma.
     */
    public function isProforma(): bool
    {
        return $this->status === OrderStatus::Proforma;
    }
}
