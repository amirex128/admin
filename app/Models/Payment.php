<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $amount
 * @property string|null $authority
 * @property string|null $ref_id
 * @property string|null $card_pan
 * @property int|null $fee
 * @property PaymentStatus $status
 * @property string|null $description
 * @property int|null $wallet_transaction_id
 * @property Carbon|null $paid_at
 * @property array<string, mixed>|null $meta
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    /**
     * The window, in minutes, during which a paid transaction can be reversed
     * before it must instead be refunded.
     */
    public const REVERSIBLE_WINDOW_MINUTES = 30;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'amount',
        'authority',
        'ref_id',
        'card_pan',
        'fee',
        'status',
        'description',
        'wallet_transaction_id',
        'paid_at',
        'meta',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'fee' => 'integer',
            'status' => PaymentStatus::class,
            'paid_at' => 'datetime',
            'meta' => 'array',
        ];
    }

    /**
     * The user who initiated the payment.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The wallet credit produced once the payment was verified.
     *
     * @return BelongsTo<WalletTransaction, $this>
     */
    public function walletTransaction(): BelongsTo
    {
        return $this->belongsTo(WalletTransaction::class);
    }

    /**
     * Whether the payment can still be reversed at the gateway (within the
     * 30 minute settlement window).
     */
    public function isReversible(): bool
    {
        return $this->status === PaymentStatus::Paid
            && $this->paid_at !== null
            && $this->paid_at->diffInMinutes(now()) < self::REVERSIBLE_WINDOW_MINUTES;
    }

    /**
     * Whether the payment can be refunded (the reversal window has passed).
     */
    public function isRefundable(): bool
    {
        return $this->status === PaymentStatus::Paid
            && $this->paid_at !== null
            && $this->paid_at->diffInMinutes(now()) >= self::REVERSIBLE_WINDOW_MINUTES;
    }

    /**
     * Scope a query to a single status.
     *
     * @param  Builder<Payment>  $query
     */
    public function scopeWithStatus(Builder $query, PaymentStatus $status): void
    {
        $query->where('status', $status->value);
    }
}
