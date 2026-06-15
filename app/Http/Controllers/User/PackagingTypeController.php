<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StorePackagingTypeRequest;
use App\Http\Requests\User\UpdatePackagingTypeRequest;
use App\Models\PackagingType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackagingTypeController extends Controller
{
    /**
     * Store a new packaging type for the authenticated user.
     */
    public function store(StorePackagingTypeRequest $request): RedirectResponse
    {
        $request->user()->packagingTypes()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'نوع بسته‌بندی ایجاد شد.']);

        return back();
    }

    /**
     * Update one of the user's packaging types.
     */
    public function update(UpdatePackagingTypeRequest $request, PackagingType $packagingType): RedirectResponse
    {
        $packagingType->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'نوع بسته‌بندی بروزرسانی شد.']);

        return back();
    }

    /**
     * Delete one of the user's packaging types.
     */
    public function destroy(Request $request, PackagingType $packagingType): RedirectResponse
    {
        abort_unless($packagingType->user_id === $request->user()->id, 403);

        $packagingType->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'نوع بسته‌بندی حذف شد.']);

        return back();
    }
}
