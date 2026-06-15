<?php

namespace App\Http\Controllers\User;

use App\Enums\MediaCollection;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreEditorImageRequest;
use App\Models\Media;
use App\Models\Product;
use App\Services\Media\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProductMediaController extends Controller
{
    public function __construct(private readonly MediaService $mediaService) {}

    /**
     * Store an image uploaded from within the rich text editor and return its
     * URL so it can be embedded in the product description.
     */
    public function storeEditorImage(StoreEditorImageRequest $request): JsonResponse
    {
        $user = $request->user();
        $target = $user;

        if ($request->filled('product_id')) {
            $product = Product::query()->ownedBy($user)->whereKey($request->integer('product_id'))->first();

            if ($product !== null) {
                $target = $product;
            }
        }

        $media = $this->mediaService->store($request->file('image'), $target, MediaCollection::Editor, $user);

        return response()->json(['url' => $media->url(), 'id' => $media->id]);
    }

    /**
     * Centrally delete a media file owned by the user.
     */
    public function destroy(Request $request, Media $media): RedirectResponse
    {
        abort_unless($media->user_id === $request->user()->id, 403);

        $this->mediaService->delete($media);

        return back();
    }
}
