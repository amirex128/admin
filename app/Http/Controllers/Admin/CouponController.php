<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    /**
     * Display every coupon across the platform with an owner filter.
     */
    public function index(Request $request): Response
    {
        $coupons = Coupon::query()
            ->with('user:id,name')
            ->withCount('products')
            ->when($request->string('search')->toString(), fn ($q, string $search) => $q->where('code', 'like', "%{$search}%"))
            ->when($request->string('user')->toString(), function ($query, string $owner): void {
                $query->whereHas('user', function ($u) use ($owner): void {
                    $u->where('name', 'like', "%{$owner}%")->orWhere('id', $owner);
                });
            })
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Coupon $coupon) => CouponResource::make($coupon)->resolve());

        return Inertia::render('admin/coupons/index', [
            'coupons' => $coupons,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'user' => $request->string('user')->toString(),
            ],
        ]);
    }

    /**
     * Toggle the active state of any coupon.
     */
    public function toggle(Coupon $coupon): RedirectResponse
    {
        $coupon->update(['is_active' => ! $coupon->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $coupon->is_active ? 'کد تخفیف فعال شد.' : 'کد تخفیف غیرفعال شد.',
        ]);

        return back();
    }

    /**
     * Delete any coupon.
     */
    public function destroy(Coupon $coupon): RedirectResponse
    {
        $coupon->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'کد تخفیف حذف شد.']);

        return back();
    }
}
