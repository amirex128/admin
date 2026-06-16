<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\ShippingMethod;
use App\Models\Order;
use Closure;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Shared order list filtering used by the seller and admin order controllers.
 *
 * Supports the status tab (including the "unpaid" payment tab) plus the
 * advanced filters: shipping/payment method, registration & ship date
 * ranges, price range and sorting.
 */
trait FiltersOrders
{
    /**
     * Apply every supported filter and sort to the order query.
     *
     * @param  Builder<Order>  $query
     */
    protected function applyOrderFilters(Builder $query, Request $request): void
    {
        $status = $request->string('status')->toString();

        if ($status === OrderPaymentStatus::Unpaid->value) {
            $query->where('payment_status', OrderPaymentStatus::Unpaid);
        } elseif ($enum = OrderStatus::tryFrom($status)) {
            $query->where('status', $enum);
        }

        $query
            ->when($request->string('search')->toString(), function ($q, string $search): void {
                $q->where(fn ($inner) => $inner
                    ->where('code', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%"));
            })
            ->when($request->enum('shipping_method', ShippingMethod::class), fn ($q, ShippingMethod $m) => $q->where('shipping_method', $m))
            ->when($request->enum('payment_method', OrderPaymentMethod::class), fn ($q, OrderPaymentMethod $m) => $q->where('payment_method', $m))
            ->when($request->date('date_from'), fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date('date_to'), fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($request->date('ship_from'), fn ($q, $date) => $q->whereDate('shipped_at', '>=', $date))
            ->when($request->date('ship_to'), fn ($q, $date) => $q->whereDate('shipped_at', '<=', $date))
            ->when($request->integer('price_min'), fn ($q, int $min) => $q->where('total', '>=', $min))
            ->when($request->integer('price_max'), fn ($q, int $max) => $q->where('total', '<=', $max));

        match ($request->string('sort')->toString()) {
            'oldest' => $query->oldest('id'),
            'cheapest' => $query->orderBy('total')->orderBy('id'),
            'expensive' => $query->orderByDesc('total')->orderByDesc('id'),
            default => $query->latest('id'),
        };
    }

    /**
     * The filter values echoed back to the frontend.
     *
     * @return array<string, mixed>
     */
    protected function orderFilters(Request $request): array
    {
        return [
            'status' => $request->string('status')->toString() ?: null,
            'search' => $request->string('search')->toString(),
            'shipping_method' => $request->string('shipping_method')->toString() ?: null,
            'payment_method' => $request->string('payment_method')->toString() ?: null,
            'date_from' => $request->string('date_from')->toString() ?: null,
            'date_to' => $request->string('date_to')->toString() ?: null,
            'ship_from' => $request->string('ship_from')->toString() ?: null,
            'ship_to' => $request->string('ship_to')->toString() ?: null,
            'price_min' => $request->integer('price_min') ?: null,
            'price_max' => $request->integer('price_max') ?: null,
            'sort' => $request->string('sort')->toString() ?: null,
        ];
    }

    /**
     * Build the status tab definitions (with counts) for the order list.
     *
     * @param  Closure(): Builder<Order>  $baseQuery  A factory returning a fresh, unfiltered base query.
     * @return array<int, array{value: string, label: string, count: int}>
     */
    protected function statusTabs(Closure $baseQuery): array
    {
        $statusCounts = $baseQuery()
            ->toBase()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $tabs = [[
            'value' => 'all',
            'label' => 'همه',
            'count' => (int) $baseQuery()->count(),
        ]];

        foreach (OrderStatus::cases() as $case) {
            $tabs[] = [
                'value' => $case->value,
                'label' => $case->label(),
                'count' => (int) ($statusCounts[$case->value] ?? 0),
            ];
        }

        $tabs[] = [
            'value' => OrderPaymentStatus::Unpaid->value,
            'label' => OrderPaymentStatus::Unpaid->label(),
            'count' => (int) $baseQuery()->where('payment_status', OrderPaymentStatus::Unpaid)->count(),
        ];

        return $tabs;
    }
}
