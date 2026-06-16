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
 * @property string|null $persian_name
 * @property string|null $business_type
 * @property string|null $store_phone
 * @property int|null $province_id
 * @property int|null $city_id
 * @property string|null $postal_code
 * @property string|null $latitude
 * @property string|null $longitude
 * @property array<string, string|null>|null $socials
 * @property string|null $about_us
 * @property string|null $buying_guide
 * @property string|null $return_policy
 * @property string|null $terms
 * @property array<int, array<string, mixed>>|null $faqs
 * @property array<int, array<string, mixed>>|null $badges
 * @property string|null $subdomain
 * @property string|null $custom_domain
 * @property string $domain_status
 * @property string $template
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
        'domain_status' => 'none',
        'template' => 'classic',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'persian_name',
        'business_type',
        'store_phone',
        'province_id',
        'city_id',
        'postal_code',
        'latitude',
        'longitude',
        'socials',
        'about_us',
        'buying_guide',
        'return_policy',
        'terms',
        'faqs',
        'badges',
        'subdomain',
        'custom_domain',
        'domain_status',
        'template',
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
            'socials' => 'array',
            'faqs' => 'array',
            'badges' => 'array',
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
