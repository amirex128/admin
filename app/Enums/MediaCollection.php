<?php

namespace App\Enums;

/**
 * The logical grouping a media file belongs to on its parent model.
 */
enum MediaCollection: string
{
    case Image = 'image';
    case Video = 'video';
    case Editor = 'editor';

    /**
     * The maximum number of files allowed in this collection per model.
     */
    public function maxFiles(): int
    {
        return match ($this) {
            self::Image => 20,
            self::Video => 1,
            self::Editor => 200,
        };
    }

    /**
     * The maximum size, in kilobytes, allowed for a single file.
     */
    public function maxSizeKilobytes(): int
    {
        return match ($this) {
            self::Image, self::Editor => 5632, // 5.5 MB
            self::Video => 51200, // 50 MB
        };
    }
}
