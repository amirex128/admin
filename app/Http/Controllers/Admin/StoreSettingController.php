<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\BuildsStoreSettingProps;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStoreSettingRequest;
use App\Models\User;
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
     * Show a seller's store settings from the admin user hub.
     */
    public function edit(Request $request, User $user): Response
    {
        return Inertia::render('admin/users/store-settings', array_merge(
            $this->storeSettingProps($user, $request, $this->service),
            [
                'targetUser' => ['id' => $user->id, 'name' => $user->name, 'phone' => $user->phone],
                'updateUrl' => route('admin.users.store-settings.update', $user),
            ],
        ));
    }

    /**
     * Persist a seller's store settings on their behalf.
     */
    public function update(UpdateStoreSettingRequest $request, User $user): RedirectResponse
    {
        $this->service->update($this->service->forUser($user), $request->settingsData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'تنظیمات فروشگاه کاربر ذخیره شد.']);

        return back();
    }
}
