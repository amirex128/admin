<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Concerns\BuildsStoreSettingProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStoreSettingRequest;
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
        return Inertia::render('settings/store', array_merge(
            $this->storeSettingProps($request->user(), $request, $this->service),
            ['updateUrl' => route('settings.store.update')],
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
