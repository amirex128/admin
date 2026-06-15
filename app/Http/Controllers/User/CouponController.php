<?php

namespace App\Http\Controllers\User;

use App\Enums\DiscountType;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreCouponRequest;
use App\Http\Requests\User\UpdateCouponRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Models\Product;
use App\Services\Coupon\CouponService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function __construct(private readonly CouponService $coupons) {}

    /**
     * Display the seller's coupons.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $coupons = Coupon::query()
            ->ownedBy($user)
            ->withCount('products')
            ->with('products:id')
            ->when($request->string('search')->toString(), fn ($q, string $search) => $q->where('code', 'like', "%{$search}%"))
            ->when($request->filled('status'), fn ($q) => $q->where('is_active', $request->string('status')->toString() === 'active'))
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Coupon $coupon) => CouponResource::make($coupon)->resolve());

        return Inertia::render('coupons/index', [
            'coupons' => $coupons,
            'products' => Product::query()->ownedBy($user)->roots()->orderBy('name')->get(['id', 'name']),
            'discountTypes' => DiscountType::options(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString() ?: null,
            ],
        ]);
    }

    /**
     * Store a new coupon.
     */
    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $this->coupons->persist($request->user(), $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'کد تخفیف ایجاد شد.']);

        return back();
    }

    /**
     * Update a coupon.
     */
    public function update(UpdateCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $this->coupons->persist($request->user(), $request->validated(), $coupon);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'کد تخفیف بروزرسانی شد.']);

        return back();
    }

    /**
     * Toggle the active state of a coupon.
     */
    public function toggle(Request $request, Coupon $coupon): RedirectResponse
    {
        $this->authorize('update', $coupon);

        $coupon->update(['is_active' => ! $coupon->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $coupon->is_active ? 'کد تخفیف فعال شد.' : 'کد تخفیف غیرفعال شد.',
        ]);

        return back();
    }

    /**
     * Delete a coupon.
     */
    public function destroy(Request $request, Coupon $coupon): RedirectResponse
    {
        $this->authorize('delete', $coupon);

        $coupon->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'کد تخفیف حذف شد.']);

        return back();
    }
}
