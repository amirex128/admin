<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductApprovalStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectProductRequest;
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
     * Display every product across all users, with filtering by owner.
     */
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->roots()
            ->with(['category', 'media', 'user'])
            ->withCount('variations')
            ->when($request->string('search')->toString(), function ($query, string $search): void {
                $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"));
            })
            ->when($request->string('user')->toString(), function ($query, string $user): void {
                $query->whereHas('user', function ($q) use ($user): void {
                    $q->where('name', 'like', "%{$user}%")
                        ->orWhere('phone', 'like', "%{$user}%")
                        ->orWhere('id', $user);
                });
            })
            ->when(
                ProductApprovalStatus::tryFrom($request->string('approval')->toString()),
                fn ($query, ProductApprovalStatus $status) => $query->withApproval($status),
            )
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Product $product) => ProductResource::make($product)->resolve());

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'approvalStatuses' => ProductApprovalStatus::options(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'user' => $request->string('user')->toString(),
                'approval' => $request->string('approval')->toString() ?: null,
            ],
        ]);
    }

    /**
     * Approve a product so it becomes publishable.
     */
    public function approve(Product $product): RedirectResponse
    {
        $product->update([
            'approval_status' => ProductApprovalStatus::Approved,
            'rejection_reason' => null,
            'reviewed_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول تأیید شد.']);

        return back();
    }

    /**
     * Reject a product with a reason shown back to the seller.
     */
    public function reject(RejectProductRequest $request, Product $product): RedirectResponse
    {
        $product->update([
            'approval_status' => ProductApprovalStatus::Rejected,
            'rejection_reason' => $request->validated('reason'),
            'reviewed_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول رد شد.']);

        return back();
    }

    /**
     * Toggle the active state of any product.
     */
    public function toggle(Product $product): RedirectResponse
    {
        $product->update(['is_active' => ! $product->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $product->is_active ? 'محصول فعال شد.' : 'محصول غیرفعال شد.',
        ]);

        return back();
    }

    /**
     * Remove any product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->productService->delete($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'محصول حذف شد.']);

        return back();
    }
}
