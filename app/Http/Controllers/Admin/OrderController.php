<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\SalesUnit;
use App\Enums\ShippingMethod;
use App\Http\Controllers\Concerns\FiltersOrders;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrderRequest;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Requests\User\UpdateOrderPaymentRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Order\OrderPdfService;
use App\Services\Order\OrderService;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    use FiltersOrders;

    public function __construct(private readonly OrderService $orderService) {}

    /**
     * Display every order across all sellers, filterable by owner.
     */
    public function index(Request $request): InertiaResponse
    {
        $userFilter = $request->string('user')->toString();

        $query = Order::query()->with('user')->withCount('items');
        $this->applyUserFilter($query, $userFilter);
        $this->applyOrderFilters($query, $request);

        $orders = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Order $order) => OrderResource::make($order)->resolve());

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => array_merge($this->orderFilters($request), ['user' => $userFilter ?: null]),
            'statusTabs' => $this->statusTabs(function () use ($userFilter) {
                $base = Order::query();
                $this->applyUserFilter($base, $userFilter);

                return $base;
            }),
            'shippingMethods' => ShippingMethod::options(),
            'paymentMethods' => OrderPaymentMethod::options(),
        ]);
    }

    /**
     * Show the manual order creation form. Admin first selects a seller, whose
     * products are then loaded via a partial reload.
     */
    public function create(Request $request): InertiaResponse
    {
        $selectedUserId = $request->integer('user_id') ?: null;
        $selectedUser = $selectedUserId ? User::query()->find($selectedUserId) : null;

        return Inertia::render('admin/orders/form', [
            'users' => User::query()->orderBy('name')->get(['id', 'name', 'phone'])->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
            ])->all(),
            'selectedUserId' => $selectedUserId,
            'products' => $selectedUser ? $this->productsFor($selectedUser) : [],
            'statusOptions' => OrderStatus::options(),
            'shippingMethods' => ShippingMethod::options(),
            'paymentMethods' => OrderPaymentMethod::options(),
            'paymentStatusOptions' => OrderPaymentStatus::options(),
            'salesUnits' => SalesUnit::options(),
        ]);
    }

    /**
     * Store an order created by the admin on behalf of a seller.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $owner = User::query()->findOrFail($request->integer('user_id'));

        $order = $this->orderService->create($owner, $request->validated(), $request->user());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $order->isProforma() ? 'پیش‌فاکتور با موفقیت صادر شد.' : 'سفارش با موفقیت ثبت شد.',
        ]);

        return to_route('admin.orders.show', $order);
    }

    /**
     * Display a single order with its wizard, items and history.
     */
    public function show(Order $order): InertiaResponse
    {
        $order->load(['items', 'user', 'statusHistories' => fn ($q) => $q->latest('id')]);

        return Inertia::render('admin/orders/show', [
            'order' => OrderResource::make($order)->resolve(),
            'statusOptions' => OrderStatus::options(),
            'paymentStatusOptions' => OrderPaymentStatus::options(),
        ]);
    }

    /**
     * Advance (or change) the order status.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        $this->orderService->updateStatus(
            order: $order,
            status: $request->enum('status', OrderStatus::class),
            note: $request->string('note')->toString() ?: null,
            trackingCode: $request->string('tracking_code')->toString() ?: null,
            performedBy: $request->user(),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'وضعیت سفارش بروزرسانی شد.']);

        return back();
    }

    /**
     * Update the payment status of the order.
     */
    public function updatePayment(UpdateOrderPaymentRequest $request, Order $order): RedirectResponse
    {
        $this->orderService->markPayment($order, $request->enum('payment_status', OrderPaymentStatus::class));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'وضعیت پرداخت بروزرسانی شد.']);

        return back();
    }

    /**
     * Download the invoice / proforma PDF for the order.
     */
    public function pdf(Order $order, OrderPdfService $pdfService): Response
    {
        return response($pdfService->render($order), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$pdfService->filename($order).'"',
        ]);
    }

    /**
     * Apply the owner (seller) search filter to the query.
     *
     * @param  Builder<Order>  $query
     */
    protected function applyUserFilter($query, string $userFilter): void
    {
        $query->when($userFilter, function ($q, string $user): void {
            $q->whereHas('user', fn ($inner) => $inner
                ->where('name', 'like', "%{$user}%")
                ->orWhere('phone', 'like', "%{$user}%")
                ->orWhere('id', $user));
        });
    }

    /**
     * The selectable products belonging to a seller.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function productsFor(User $user): array
    {
        return Product::query()
            ->ownedBy($user)
            ->roots()
            ->orderBy('name')
            ->get(['id', 'name', 'price', 'sales_unit'])
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'sales_unit' => $product->sales_unit->value,
            ])
            ->all();
    }
}
