<?php

namespace App\Services\Media;

use App\Enums\MediaCollection;
use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Central service for storing, copying and deleting media files.
 *
 * IMPORTANT: All media file movements across the project MUST go through this
 * service so that the database records and the files on disk never drift apart
 * and deletions always remove the underlying file.
 */
class MediaService
{
    /**
     * The disk media files are stored on.
     */
    protected string $disk = 'public';

    /**
     * Store an uploaded file and attach it to the given model.
     */
    public function store(UploadedFile $file, Model $model, MediaCollection $collection, User $owner): Media
    {
        $path = $file->store($this->directoryFor($collection), $this->disk);

        return $model->media()->create([
            'user_id' => $owner->id,
            'collection' => $collection->value,
            'disk' => $this->disk,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'sort_order' => $this->nextSortOrder($model, $collection),
        ]);
    }

    /**
     * Delete a single media record together with its file on disk.
     */
    public function delete(Media $media): void
    {
        Storage::disk($media->disk)->delete($media->path);

        $media->delete();
    }

    /**
     * Delete every media file attached to the given model.
     */
    public function deleteForModel(Model $model): void
    {
        $model->media()->get()->each(fn (Media $media) => $this->delete($media));
    }

    /**
     * Copy a media record (and its underlying file) onto a target model,
     * returning the freshly created media record.
     */
    public function copyTo(Media $media, Model $target): Media
    {
        $extension = pathinfo($media->path, PATHINFO_EXTENSION);
        $newPath = $this->directoryFor($media->collection).'/'.Str::uuid()->toString().($extension !== '' ? ".{$extension}" : '');

        $disk = Storage::disk($media->disk);

        if ($disk->exists($media->path)) {
            $disk->copy($media->path, $newPath);
        }

        return $target->media()->create([
            'user_id' => $media->user_id,
            'collection' => $media->collection->value,
            'disk' => $media->disk,
            'path' => $newPath,
            'original_name' => $media->original_name,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'sort_order' => $media->sort_order,
        ]);
    }

    /**
     * The storage directory for the given collection.
     */
    protected function directoryFor(MediaCollection $collection): string
    {
        return 'products/'.$collection->value;
    }

    /**
     * Determine the next sort order value within a collection.
     */
    protected function nextSortOrder(Model $model, MediaCollection $collection): int
    {
        return (int) $model->media()
            ->where('collection', $collection->value)
            ->max('sort_order') + 1;
    }
}
