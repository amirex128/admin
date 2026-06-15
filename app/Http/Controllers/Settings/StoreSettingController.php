<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Concerns\BuildsStoreSettingProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStoreSettingRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PackagingTypeResource;
use App\Services\Store\StoreSettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreSettingController extends Controller
{
    use BuildsStoreSettingProps;

    public function __construct(private readonly StoreSettingService $service) {}

    /**
     * Show the seller's store settings.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/store', array_merge(
            $this->storeSettingProps($user, $request, $this->service),
            [
                'updateUrl' => route('settings.store.update'),
                'taxonomy' => [
                    'categories' => CategoryResource::collection(
                        $user->categories()->with('parent')->withCount('products')->orderBy('name')->get()
                    )->resolve(),
                    'packagingTypes' => PackagingTypeResource::collection(
                        $user->packagingTypes()->orderBy('name')->get()
                    )->resolve(),
                ],
            ],
        ));
    }

    /**
     * Persist the seller's store settings.
     */
    public function update(UpdateStoreSettingRequest $request): RedirectResponse
    {
        $this->service->update($this->service->forUser($request->user()), $request->settingsData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'تنظیمات فروشگاه ذخیره شد.']);

        return back();
    }
}
