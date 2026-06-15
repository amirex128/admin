<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePlanRequest;
use App\Http\Requests\Admin\UpdatePlanRequest;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    /**
     * Display the list of subscription plans.
     */
    public function index(): Response
    {
        $plans = Plan::query()
            ->withCount('subscriptions')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('admin/plans/index', [
            'plans' => PlanResource::collection($plans),
        ]);
    }

    /**
     * Store a newly created plan.
     */
    public function store(StorePlanRequest $request): RedirectResponse
    {
        Plan::create($request->planAttributes());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'پلن جدید ایجاد شد.']);

        return to_route('admin.plans.index');
    }

    /**
     * Update an existing plan.
     */
    public function update(UpdatePlanRequest $request, Plan $plan): RedirectResponse
    {
        $plan->update($request->planAttributes());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'پلن بروزرسانی شد.']);

        return to_route('admin.plans.index');
    }

    /**
     * Toggle the active state of a plan.
     */
    public function toggle(Plan $plan): RedirectResponse
    {
        $plan->update(['is_active' => ! $plan->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $plan->is_active ? 'پلن فعال شد.' : 'پلن غیرفعال شد.',
        ]);

        return back();
    }

    /**
     * Remove a plan.
     */
    public function destroy(Plan $plan): RedirectResponse
    {
        $plan->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'پلن حذف شد.']);

        return to_route('admin.plans.index');
    }
}
