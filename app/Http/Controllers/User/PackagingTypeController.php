<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StorePackagingTypeRequest;
use Illuminate\Http\RedirectResponse;
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
}
