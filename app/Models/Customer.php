<?php

namespace App\Models;

use App\Enums\CustomerStatus;
use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A buyer recorded in a seller's CRM. Created automatically whenever an order
 * or pre-invoice is issued and managed manually or via spreadsheet import.
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $national_code
 * @property string|null $province
 * @property string|null $city
 * @property string|null $address
 * @property string|null $postal_code
 * @property CustomerStatus $status
 * @property string|null $note
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Customer extends Model
{
    /** @use HasFactory<CustomerFactory> */
    use HasFactory;

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => CustomerStatus::Active->value,
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'national_code',
        'province',
        'city',
        'address',
        'postal_code',
        'status',
        'note',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => CustomerStatus::class,
        ];
    }

    /**
     * The seller that owns the customer record.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The orders placed by this customer.
     *
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Restrict the query to customers owned by the given user.
     *
     * @param  Builder<Customer>  $query
     */
    public function scopeOwnedBy(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }

    /**
     * Restrict the query to customers with the given status.
     *
     * @param  Builder<Customer>  $query
     */
    public function scopeWithStatus(Builder $query, CustomerStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Whether the customer is currently blocked from new purchases.
     */
    public function isBlocked(): bool
    {
        return $this->status === CustomerStatus::Blocked;
    }
}
