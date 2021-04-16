<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function index(Request $request)
    {
        return Article::query()->withCount(['categories','tags','user','comments'])->latest()->paginate($request->input('per_page',10));
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
            'status' => 'required|in:draft,publish,schedule',
            'robots' => 'required|in:noindex, nofollow, none,all',
            'canonical' => 'required|boolean',
            'schedule' => 'required|date|date_after:now',
            'category_id.*'=>'required|exists:id,categories',
            'tag_id.*'=>'required|exists:id,tags',
        ]);

        $request->merge(['user_id' => auth()->id()]);

        $article = Article::query()->create($request->only([
            'user_id',
            'title',
            'description',
            'slug',
            'body',
            'thumbnail',
            'status',
            'robots',
            'canonical',
            'schedule',
        ]));


        if ($request->filled('category_id.*')){
            $article->categories()->sync($request->category_id);
        }
        if ($request->filled('tag_id.*')){
            $article->tags()->sync($request->tag_id);
        }
        return response(['status'=>'created','message'=>'مقاله با موفقیت ایجاد شد']);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Article $article
     * @return Article
     */
    public function show(Article $article)
    {
        return $article->load(['categories','tags','user','comment']);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Article $article)
    {
        $this->validate($request, [
            'title' => 'nullable|string|max:300',
            'description' => 'nullable|string|max:300',
            'slug' => 'nullable|string|max:500',
            'body' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:500',
            'status' => 'nullable|in:draft,publish,schedule',
            'robots' => 'nullable|in:noindex, nofollow, none,all',
            'canonical' => 'nullable|boolean',
            'schedule' => 'nullable|date|date_after:now',
            'category_id.*'=>'required|exists:id,categories',
            'tag_id.*'=>'required|exists:id,tags',
        ]);


        $article->update($request->only([
            'title',
            'description',
            'slug',
            'body',
            'thumbnail',
            'status',
            'robots',
            'canonical',
            'schedule',
        ]));

        if ($request->filled('category_id.*')){
            $article->categories()->sync($request->category_id);
        }
        if ($request->filled('tag_id.*')){
            $article->tags()->sync($request->tag_id);
        }

        return response(['status'=>'updated','message'=>'مقاله با موفقیت بروزرسانی شد']);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return response(['status'=>'deleted','message'=>'مقاله با موفقیت حذف شد']);

    }
}
