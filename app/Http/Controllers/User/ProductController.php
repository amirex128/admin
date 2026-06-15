<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderMode;
use App\Enums\SalesUnit;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreProductRequest;
use App\Http\Requests\User\UpdateProductRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PackagingTypeResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\Product\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    /**
     * Display the user's products.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $products = Product::query()
            ->ownedBy($user)
            ->roots()
            ->with(['category', 'media', 'variations.media'])
            ->withCount('variations')
            ->when($request->string('search')->toString(), function ($query, string $search): void {
                $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"));
            })
            ->when($request->integer('category_id'), fn ($query, int $categoryId) => $query->where('category_id', $categoryId))
            ->when($request->filled('status'), fn ($query) => $query->where('is_active', $request->string('status')->toString() === 'active'))
            ->latest('id')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product) => ProductResource::make($product)->resolve());

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => CategoryResource::collection($user->categories()->withCount('products')->orderBy('name')->get()),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'category_id' => $request->integer('category_id') ?: null,
                'status' => $request->string('status')->toString() ?: null,
            ],
        ]);
    }

    /**
     * Show the product creation form.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('products/form', $this->formProps($request));
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->productService->store($request->user(), $request);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول با موفقیت ایجاد شد.']);

        return to_route('products.index');
    }

    /**
     * Show the product edit form.
     */
    public function edit(Request $request, Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load(['category', 'packagingType', 'attributes.values', 'media', 'variations.media']);

        return Inertia::render('products/form', array_merge($this->formProps($request), [
            'product' => ProductResource::make($product)->resolve(),
        ]));
    }

    /**
     * Update the given product.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->productService->update($product, $request);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول بروزرسانی شد.']);

        return to_route('products.index');
    }

    /**
     * Remove the given product.
     */
    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $this->productService->delete($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول حذف شد.']);

        return back();
    }

    /**
     * Duplicate the given product with all of its media and variations.
     */
    public function duplicate(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('duplicate', $product);

        $this->productService->duplicate($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول کپی شد.']);

        return back();
    }

    /**
     * Toggle the active state of the product.
     */
    public function toggle(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $product->update(['is_active' => ! $product->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $product->is_active ? 'محصول فعال شد.' : 'محصول غیرفعال شد.',
        ]);

        return back();
    }

    /**
     * Reference data shared by the create and edit forms.
     *
     * @return array<string, mixed>
     */
    protected function formProps(Request $request): array
    {
        $user = $request->user();

        return [
            'product' => null,
            'categories' => CategoryResource::collection($user->categories()->orderBy('name')->get()),
            'packagingTypes' => PackagingTypeResource::collection($user->packagingTypes()->orderBy('name')->get()),
            'salesUnits' => SalesUnit::options(),
            'orderModes' => OrderMode::options(),
            'hasAiModel' => $user->ai_model_id !== null,
        ];
    }
}
