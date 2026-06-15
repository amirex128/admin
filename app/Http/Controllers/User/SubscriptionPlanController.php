<?php

namespace App\Http\Controllers\User;

use App\Enums\WalletTransactionReason;
use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Http\Resources\SubscriptionResource;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\Wallet\InsufficientBalanceException;
use App\Services\Wallet\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPlanController extends Controller
{
    public function __construct(private readonly WalletService $walletService) {}

    /**
     * Display the available subscription plans for the user to browse.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $plans = Plan::query()
            ->active()
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        $activeSubscription = $user->subscriptions()
            ->with('plan')
            ->where('status', Subscription::STATUS_ACTIVE)
            ->latest()
            ->first();

        return Inertia::render('financial/plans', [
            'plans' => PlanResource::collection($plans),
            'balance' => $this->walletService->balance($user),
            'activeSubscription' => $activeSubscription
                ? SubscriptionResource::make($activeSubscription->loadMissing('plan'))->resolve()
                : null,
        ]);
    }

    /**
     * Subscribe the user to a plan, paying through their wallet.
     */
    public function subscribe(Request $request, Plan $plan): RedirectResponse
    {
        if (! $plan->is_active) {
            return back()->withErrors(['plan' => 'این پلن در دسترس نیست.']);
        }

        $user = $request->user();
        $price = $plan->discountedPrice();

        try {
            DB::transaction(function () use ($user, $plan, $price) {
                $user->subscriptions()
                    ->where('status', Subscription::STATUS_ACTIVE)
                    ->update(['status' => Subscription::STATUS_CANCELED]);

                $subscription = $user->subscriptions()->create([
                    'plan_id' => $plan->id,
                    'status' => Subscription::STATUS_ACTIVE,
                    'price_paid' => $price,
                    'starts_at' => now(),
                    'ends_at' => now()->addDays($plan->duration_days),
                ]);

                if ($price > 0) {
                    $this->walletService->withdraw(
                        user: $user,
                        amount: $price,
                        reason: WalletTransactionReason::SubscriptionPurchase,
                        description: "خرید اشتراک {$plan->name}",
                        reference: $subscription,
                    );
                }
            });
        } catch (InsufficientBalanceException $exception) {
            return back()->withErrors(['plan' => $exception->getMessage()]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "اشتراک {$plan->name} با موفقیت فعال شد."]);

        return to_route('plans.index');
    }
}
