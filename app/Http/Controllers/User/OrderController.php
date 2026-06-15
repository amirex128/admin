<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Enums\SalesUnit;
use App\Enums\ShippingMethod;
use App\Http\Controllers\Concerns\FiltersOrders;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreOrderRequest;
use App\Http\Requests\User\UpdateOrderPaymentRequest;
use App\Http\Requests\User\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Order\OrderPdfService;
use App\Services\Order\OrderService;
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
     * Display the seller's orders with status tabs and advanced filters.
     */
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        $query = Order::query()->ownedBy($user)->withCount('items');
        $this->applyOrderFilters($query, $request);

        $orders = $query
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Order $order) => OrderResource::make($order)->resolve());

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => $this->orderFilters($request),
            'statusTabs' => $this->statusTabs(fn () => Order::query()->ownedBy($user)),
            'statusOptions' => OrderStatus::options(),
            'shippingMethods' => ShippingMethod::options(),
            'paymentMethods' => OrderPaymentMethod::options(),
        ]);
    }

    /**
     * Show the manual order creation form.
     */
    public function create(Request $request): InertiaResponse
    {
        return Inertia::render('orders/form', $this->formProps($request->user()));
    }

    /**
     * Store a manually created order (or proforma).
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $order = $this->orderService->create($request->user(), $request->validated(), $request->user());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $order->isProforma() ? 'پیش‌فاکتور با موفقیت صادر شد.' : 'سفارش با موفقیت ثبت شد.',
        ]);

        return to_route('orders.show', $order);
    }

    /**
     * Display a single order with its wizard, items and history.
     */
    public function show(Request $request, Order $order): InertiaResponse
    {
        $this->authorize('view', $order);

        $order->load(['items', 'statusHistories' => fn ($q) => $q->latest('id')]);

        return Inertia::render('orders/show', [
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
    public function pdf(Request $request, Order $order, OrderPdfService $pdfService): Response
    {
        $this->authorize('view', $order);

        return response($pdfService->render($order), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$pdfService->filename($order).'"',
        ]);
    }

    /**
     * Reference data shared by the order form.
     *
     * @return array<string, mixed>
     */
    protected function formProps(User $user): array
    {
        $products = Product::query()
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

        return [
            'products' => $products,
            'statusOptions' => OrderStatus::options(),
            'shippingMethods' => ShippingMethod::options(),
            'paymentMethods' => OrderPaymentMethod::options(),
            'paymentStatusOptions' => OrderPaymentStatus::options(),
            'salesUnits' => SalesUnit::options(),
        ];
    }
}
