<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function index(Request $request)
    {
        return Category::query()->latest()->paginate($request->input('per_page', 10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'parent_id' => 'required|integer|exists:id,categories',
            'name' => 'required|string|max:300',
            'slug' => 'required|string|max:500',
            'description' => 'required|string|max:300',
        ]);

        Category::query()->create($request->only([
            'parent_id',
            'name',
            'slug',
            'description',
        ]));

        return response(['status'=>'created','message'=>'دسته بندی با موفقیت ایجاد شد']);


    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Category $category
     * @return Category
     */
    public function show(Category $category)
    {
        return $category;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Category $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        $this->validate($request, [
            'parent_id' => 'nullable|integer|exists:id,categories',
            'name' => 'nullable|string|max:300',
            'slug' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:300',
        ]);

        $category->update($request->only([
            'parent_id',
            'name',
            'slug',
            'description',
        ]));

        return response(['status'=>'updated','message'=>'دسته بندی با موفقیت بروزرسانی شد']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Category $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response(['status'=>'deleted','message'=>'دسته بندی با موفقیت حذف شد']);

    }
}
