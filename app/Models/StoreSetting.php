<?php

namespace App\Models;

use Database\Factories\StoreSettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Per-seller store configuration: location, payment gateways, shipping and
 * finance rules.
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $province_id
 * @property int|null $city_id
 * @property bool $card_to_card_enabled
 * @property string|null $card_holder_name
 * @property string|null $card_number
 * @property string|null $sheba_number
 * @property bool $zarinpal_enabled
 * @property string|null $zarinpal_merchant_id
 * @property string|null $zarinpal_access_token
 * @property int $vat_percent
 * @property int $refund_window_minutes
 * @property array<string, mixed>|null $shipping_methods
 * @property int $intra_city_days
 * @property int $inter_city_days
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class StoreSetting extends Model
{
    /** @use HasFactory<StoreSettingFactory> */
    use HasFactory;

    /**
     * The model's default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'card_to_card_enabled' => false,
        'zarinpal_enabled' => false,
        'vat_percent' => 0,
        'refund_window_minutes' => 30,
        'intra_city_days' => 1,
        'inter_city_days' => 3,
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'province_id',
        'city_id',
        'card_to_card_enabled',
        'card_holder_name',
        'card_number',
        'sheba_number',
        'zarinpal_enabled',
        'zarinpal_merchant_id',
        'zarinpal_access_token',
        'vat_percent',
        'refund_window_minutes',
        'shipping_methods',
        'intra_city_days',
        'inter_city_days',
    ];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'card_to_card_enabled' => 'boolean',
            'zarinpal_enabled' => 'boolean',
            'zarinpal_access_token' => 'encrypted',
            'vat_percent' => 'integer',
            'refund_window_minutes' => 'integer',
            'shipping_methods' => 'array',
            'intra_city_days' => 'integer',
            'inter_city_days' => 'integer',
        ];
    }

    /**
     * The seller that owns the settings.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The store's province.
     *
     * @return BelongsTo<Province, $this>
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * The store's city.
     *
     * @return BelongsTo<City, $this>
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
