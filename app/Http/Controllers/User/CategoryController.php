<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreCategoryRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Store a new category for the authenticated user.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $name = $request->validated('name');

        $request->user()->categories()->create([
            'name' => $name,
            'parent_id' => $request->validated('parent_id'),
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'دسته‌بندی ایجاد شد.']);

        return back();
    }
}
