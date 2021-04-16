<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function index(Request $request)
    {
        return Page::query()->latest()->paginate($request->input('per_page', 10));
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
            'title' => 'required|string|max:300',
            'description' => 'required|string|max:300',
            'slug' => 'filled|string|max:100',
            'body' => 'required|string',
            'thumbnail' => 'required|string|max:500',
            'layout' => 'required|in:blank,normal',
            'status' => 'required|in:draft,publish,schedule',
            'robots' => 'required|in:noindex, nofollow, none,all',
        ]);

        $request->merge(['user_id' => auth()->id()]);

        Page::query()->create($request->only([
            'user_id',
            'title',
            'description',
            'slug',
            'body',
            'thumbnail',
            'layout',
            'status',
            'robots',
        ]));

        return response(['status' => 'created', 'message' => 'صفحه شخصی با موفقیت ایجاد شد']);


    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Page $page
     * @return Page
     */
    public function show(Page $page)
    {
        return $page;
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Page $page
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Page $page)
    {
        $this->validate($request, [
            'title' => 'nullable|string|max:300',
            'description' => 'nullable|string|max:300',
            'slug' => 'nullable|string|max:500',
            'body' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:500',
            'layout' => 'nullable|in:blank,normal',
            'status' => 'nullable|in:draft,publish,schedule',
            'robots' => 'nullable|in:noindex, nofollow, none,all',
        ]);


        $page->update($request->only([
            'user_id',
            'title',
            'description',
            'slug',
            'body',
            'thumbnail',
            'layout',
            'status',
            'robots',
        ]));

        return response(['status' => 'updated', 'message' => 'صفحه شخصی با موفقیت بروزرسانی شد']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Page $page
     * @return \Illuminate\Http\Response
     */
    public function destroy(Page $page)
    {
        $page->delete();

        return response(['status' => 'deleted', 'message' => 'صفحه شخصی با موفقیت حذف شد']);

    }
}
