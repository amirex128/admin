<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreCategoryRequest;
use App\Http\Requests\User\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    /**
     * Update one of the user's categories.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update([
            'name' => $request->validated('name'),
            'parent_id' => $request->validated('parent_id'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'دسته‌بندی بروزرسانی شد.']);

        return back();
    }

    /**
     * Delete one of the user's categories.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_unless($category->user_id === $request->user()->id, 403);

        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'دسته‌بندی حذف شد.']);

        return back();
    }
}
