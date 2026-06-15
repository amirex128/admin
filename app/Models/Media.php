<?php

namespace App\Models;

use App\Enums\MediaCollection;
use Database\Factories\MediaFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property string $mediable_type
 * @property int $mediable_id
 * @property MediaCollection $collection
 * @property string $disk
 * @property string $path
 * @property string|null $original_name
 * @property string|null $mime_type
 * @property int $size
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Media extends Model
{
    /** @use HasFactory<MediaFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'media';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'collection',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'collection' => MediaCollection::class,
            'size' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * The model the media file is attached to.
     *
     * @return MorphTo<Model, $this>
     */
    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The user that owns the media file.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The publicly accessible URL for the stored file.
     */
    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Scope a query to a single media collection.
     *
     * @param  Builder<Media>  $query
     */
    public function scopeInCollection(Builder $query, MediaCollection $collection): void
    {
        $query->where('collection', $collection->value);
    }
}
