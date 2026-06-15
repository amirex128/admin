<?php

namespace App\Models;

use App\Enums\SalesUnit;
use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $order_id
 * @property int|null $product_id
 * @property string $name
 * @property SalesUnit|null $sales_unit
 * @property int $unit_price
 * @property int $quantity
 * @property int $discount_percent
 * @property int $total
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'sales_unit',
        'unit_price',
        'quantity',
        'discount_percent',
        'total',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sales_unit' => SalesUnit::class,
            'unit_price' => 'integer',
            'quantity' => 'integer',
            'discount_percent' => 'integer',
            'total' => 'integer',
        ];
    }

    /**
     * The order the line item belongs to.
     *
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * The product the line item references, if it still exists.
     *
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
