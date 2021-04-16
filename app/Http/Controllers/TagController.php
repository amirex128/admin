<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function index(Request $request)
    {
        return Tag::query()->latest()->paginate($request->input('per_page', 10));
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
            'name' => 'required|string|max:300',
            'slug' => 'required|string|max:500',
            'description' => 'required|string|max:300',
        ]);

        Tag::query()->create($request->only([
            'name',
            'slug',
            'description',
        ]));

        return response(['status'=>'created','message'=>'تگ با موفقیت ایجاد شد']);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Tag $tag
     * @return Tag
     */
    public function show(Tag $tag)
    {
        return $tag;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Tag $tag
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tag $tag)
    {
        $this->validate($request, [
            'name' => 'nullable|string|max:300',
            'slug' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:300',
        ]);

        $tag->update($request->only([
            'name',
            'slug',
            'description',
        ]));

        return response(['status'=>'updated','message'=>'تگ با موفقیت بروزرسانی شد']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Tag $tag
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response(['status'=>'deleted','message'=>'تگ با موفقیت حذف شد']);
    }
}
