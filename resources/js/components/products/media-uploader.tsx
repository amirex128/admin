import { Film, ImagePlus, X } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { MediaItem } from '@/types';

const MAX_IMAGES = 20;
const MAX_IMAGE_MB = 5.5;
const MAX_VIDEO_MB = 50;

/**
 * Manages a product's image gallery (up to 20) and a single optional video,
 * tracking both newly selected files and the removal of existing media.
 */
export function MediaUploader({
    existingImages,
    images,
    onImagesChange,
    existingVideo,
    video,
    onVideoChange,
    removedMediaIds,
    onRemovedMediaIdsChange,
}: {
    existingImages: MediaItem[];
    images: File[];
    onImagesChange: (files: File[]) => void;
    existingVideo: MediaItem | null;
    video: File | null;
    onVideoChange: (file: File | null) => void;
    removedMediaIds: number[];
    onRemovedMediaIdsChange: (ids: number[]) => void;
}) {
    const imageInput = useRef<HTMLInputElement>(null);
    const videoInput = useRef<HTMLInputElement>(null);

    const visibleExistingImages = existingImages.filter(
        (image) => !removedMediaIds.includes(image.id),
    );
    const totalImages = visibleExistingImages.length + images.length;

    function addImages(files: FileList | null) {
        if (!files) {
            return;
        }

        const selected = Array.from(files);
        const oversized = selected.find(
            (file) => file.size > MAX_IMAGE_MB * 1024 * 1024,
        );

        if (oversized) {
            toast.error(`حجم هر تصویر باید کمتر از ${MAX_IMAGE_MB} مگابایت باشد.`);

            return;
        }

        if (totalImages + selected.length > MAX_IMAGES) {
            toast.error(`حداکثر ${MAX_IMAGES} تصویر مجاز است.`);

            return;
        }

        onImagesChange([...images, ...selected]);
    }

    function setVideo(file: File | null) {
        if (file && file.size > MAX_VIDEO_MB * 1024 * 1024) {
            toast.error(`حجم ویدیو باید کمتر از ${MAX_VIDEO_MB} مگابایت باشد.`);

            return;
        }

        onVideoChange(file);
    }

    return (
        <div className="space-y-4">
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                        تصاویر ({totalImages}/{MAX_IMAGES})
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => imageInput.current?.click()}
                    >
                        <ImagePlus className="size-4" />
                        افزودن تصویر
                    </Button>
                    <input
                        ref={imageInput}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                            addImages(event.target.files);
                            event.target.value = '';
                        }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {visibleExistingImages.map((image) => (
                        <figure
                            key={`existing-${image.id}`}
                            className="group relative aspect-square overflow-hidden rounded-md border"
                        >
                            <img
                                src={image.url}
                                alt=""
                                className="size-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    onRemovedMediaIdsChange([
                                        ...removedMediaIds,
                                        image.id,
                                    ])
                                }
                                className="absolute top-1 left-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            >
                                <X className="size-3" />
                            </button>
                        </figure>
                    ))}

                    {images.map((file, index) => (
                        <figure
                            key={`new-${index}`}
                            className="group relative aspect-square overflow-hidden rounded-md border"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="size-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    onImagesChange(
                                        images.filter((_, i) => i !== index),
                                    )
                                }
                                className="absolute top-1 left-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            >
                                <X className="size-3" />
                            </button>
                        </figure>
                    ))}

                    {totalImages === 0 && (
                        <p className="col-span-full rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                            هنوز تصویری اضافه نشده است.
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">ویدیو (حداکثر ۱)</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => videoInput.current?.click()}
                    >
                        <Film className="size-4" />
                        انتخاب ویدیو
                    </Button>
                    <input
                        ref={videoInput}
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        className="hidden"
                        onChange={(event) => {
                            setVideo(event.target.files?.[0] ?? null);
                            event.target.value = '';
                        }}
                    />
                </div>

                {video ? (
                    <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                        <span className="truncate">{video.name}</span>
                        <button
                            type="button"
                            onClick={() => setVideo(null)}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ) : existingVideo && !removedMediaIds.includes(existingVideo.id) ? (
                    <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                        <span className="truncate">
                            {existingVideo.original_name ?? 'ویدیوی فعلی'}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                onRemovedMediaIdsChange([
                                    ...removedMediaIds,
                                    existingVideo.id,
                                ])
                            }
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ) : (
                    <p className="rounded-md border border-dashed py-4 text-center text-sm text-muted-foreground">
                        ویدیویی انتخاب نشده است.
                    </p>
                )}
            </div>
        </div>
    );
}
