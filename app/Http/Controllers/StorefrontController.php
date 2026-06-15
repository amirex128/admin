<?php

namespace App\Http\Controllers;

use App\Enums\OrderPaymentMethod;
use App\Enums\OrderStatus;
use App\Enums\ProductApprovalStatus;
use App\Enums\ShippingMethod;
use App\Http\Controllers\Concerns\ResolvesStorefront;
use App\Http\Requests\StorefrontCheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\City;
use App\Models\Order;
use App\Models\Product;
use App\Models\Province;
use App\Models\StoreSetting;
use App\Services\Order\OrderService;
use App\Services\Store\StorePaymentService;
use App\Services\Store\StoreSettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

/**
 * Renders the public, SSR + SEO-friendly storefront for a seller, resolved by
 * subdomain or custom domain. Pages live under resources/js/pages/storefront/
 * {template}; see docs/storefront-templates.md.
 */
class StorefrontController extends Controller
{
    use ResolvesStorefront;

    public function __construct(
        private readonly StoreSettingService $storeSettings,
        private readonly StorePaymentService $storePayments,
        private readonly OrderService $orders,
    ) {}

    /**
     * Storefront home page with product, special-offer and category carousels.
     */
    public function home(string $store): Response
    {
        $settings = $this->resolveStore($store);
        $owner = $settings->user;

        $base = fn () => Product::query()->where('user_id', $owner->id)->roots()
            ->where('is_active', true)->withApproval(ProductApprovalStatus::Approved)
            ->with(['media', 'category']);

        return $this->render($settings, 'home', [
            'specialProducts' => $base()->where('is_special_offer', true)->latest('id')->limit(12)->get()
                ->map(fn (Product $p) => ProductResource::make($p)->resolve()),
            'latestProducts' => $base()->latest('id')->limit(12)->get()
                ->map(fn (Product $p) => ProductResource::make($p)->resolve()),
        ]);
    }

    /**
     * Product detail page with gallery, variations and attributes.
     */
    public function product(string $store, Product $product): Response
    {
        $settings = $this->resolveStore($store);

        abort_unless(
            $product->user_id === $settings->user_id
                && $product->is_active
                && $product->approval_status === ProductApprovalStatus::Approved,
            HttpResponse::HTTP_NOT_FOUND,
        );

        $product->load(['category', 'packagingType', 'attributes.values', 'media', 'variations.media']);

        return $this->render($settings, 'product', [
            'product' => ProductResource::make($product)->resolve(),
        ]);
    }

    /**
     * Category listing page.
     */
    public function category(string $store, Category $category): Response
    {
        $settings = $this->resolveStore($store);

        abort_unless($category->user_id === $settings->user_id, HttpResponse::HTTP_NOT_FOUND);

        $products = Product::query()->where('user_id', $settings->user_id)->roots()
            ->where('is_active', true)->withApproval(ProductApprovalStatus::Approved)
            ->where('category_id', $category->id)
            ->with(['media', 'category'])
            ->latest('id')
            ->paginate(12)
            ->through(fn (Product $p) => ProductResource::make($p)->resolve());

        return $this->render($settings, 'category', [
            'category' => ['id' => $category->id, 'name' => $category->name],
            'products' => $products,
        ]);
    }

    /**
     * A rich-text content page (about/buying guide/return policy/terms).
     */
    public function page(string $store, string $slug): Response
    {
        $settings = $this->resolveStore($store);

        $map = [
            'about' => ['درباره ما', $settings->about_us],
            'buying-guide' => ['راهنمای خرید', $settings->buying_guide],
            'return-policy' => ['شرایط بازگشت', $settings->return_policy],
            'terms' => ['قوانین و مقررات', $settings->terms],
        ];

        abort_unless(isset($map[$slug]), HttpResponse::HTTP_NOT_FOUND);

        return $this->render($settings, 'page', [
            'page' => ['title' => $map[$slug][0], 'html' => $map[$slug][1] ?? ''],
        ]);
    }

    /**
     * Frequently asked questions page.
     */
    public function faq(string $store): Response
    {
        $settings = $this->resolveStore($store);

        return $this->render($settings, 'faq', [
            'faqs' => $settings->faqs ?? [],
        ]);
    }

    /**
     * Cart page (cart state is held client-side).
     */
    public function cart(string $store): Response
    {
        return $this->render($this->resolveStore($store), 'cart', []);
    }

    /**
     * Checkout page with the store's available payment & shipping options.
     * Cities reload via a partial reload when the province changes.
     */
    public function checkout(Request $request, string $store): Response
    {
        $settings = $this->resolveStore($store);
        $provinceId = $request->integer('province_id');

        return $this->render($settings, 'checkout', [
            'provinces' => Province::query()->orderBy('name')->get(['id', 'name']),
            'cities' => $provinceId
                ? City::query()->where('province_id', $provinceId)->orderBy('name')->get(['id', 'name'])
                : [],
            'paymentMethods' => $this->availablePaymentMethods($settings),
            'shippingMethods' => $this->availableShippingMethods($settings),
            'cardToCard' => $settings->card_to_card_enabled ? [
                'holder' => $settings->card_holder_name,
                'card' => $settings->card_number,
                'sheba' => $settings->sheba_number,
            ] : null,
        ]);
    }

    /**
     * Place an order from the storefront cart and start payment.
     */
    public function placeOrder(StorefrontCheckoutRequest $request, string $store): RedirectResponse|HttpResponse
    {
        $settings = $this->resolveStore($store);
        $owner = $settings->user;
        $validated = $request->validated();

        $products = Product::query()->where('user_id', $owner->id)->roots()
            ->where('is_active', true)->withApproval(ProductApprovalStatus::Approved)
            ->whereIn('id', collect($validated['items'])->pluck('product_id'))
            ->get()->keyBy('id');

        $items = collect($validated['items'])
            ->map(function (array $row) use ($products): ?array {
                $product = $products->get($row['product_id']);

                if ($product === null) {
                    return null;
                }

                return [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sales_unit' => $product->sales_unit->value,
                    'unit_price' => $product->discountedPrice(),
                    'quantity' => (int) $row['quantity'],
                    'discount_percent' => 0,
                ];
            })
            ->filter()
            ->values()
            ->all();

        if ($items === []) {
            return back()->withErrors(['items' => 'سبد خرید نامعتبر است.']);
        }

        $cityId = $validated['city_id'] ?? null;
        $shippingMethod = $validated['shipping_method'] ?? null;
        $shippingCost = $shippingMethod !== null
            ? $this->storeSettings->shippingCost($settings, $shippingMethod, $this->storeSettings->isIntraCity($settings, $cityId))
            : 0;

        $order = $this->orders->create($owner, [
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'province' => $cityId ? optional(Province::find($validated['province_id'] ?? null))->name : ($validated['province_id'] ?? null),
            'city' => $cityId ? optional(City::find($cityId))->name : null,
            'address' => $validated['address'] ?? null,
            'shipping_method' => $shippingMethod,
            'shipping_cost' => $shippingCost,
            'payment_method' => $validated['payment_method'],
            'status' => OrderStatus::AwaitingConfirmation->value,
            'items' => $items,
        ]);

        if (
            $validated['payment_method'] === OrderPaymentMethod::Online->value
            && $this->storePayments->canUseZarinpal($settings)
        ) {
            $callback = route('storefront.payment.callback', ['store' => $store, 'order' => $order->code]);

            try {
                $redirectUrl = $this->storePayments->initiate($settings, $order, $callback);

                return Inertia::location($redirectUrl);
            } catch (\Throwable) {
                // Fall through to the result page with a payment error notice.
                return redirect()->route('storefront.order', [
                    'store' => $store, 'code' => $order->code, 'phone' => $order->customer_phone,
                ])->with('payment_error', true);
            }
        }

        return redirect()->route('storefront.order', [
            'store' => $store, 'code' => $order->code, 'phone' => $order->customer_phone,
        ]);
    }

    /**
     * Handle the returning ZarinPal payment for a storefront order.
     */
    public function paymentCallback(Request $request, string $store): RedirectResponse
    {
        $settings = $this->resolveStore($store);

        $order = Order::query()
            ->where('user_id', $settings->user_id)
            ->where('code', $request->string('order'))
            ->firstOrFail();

        $this->storePayments->verify(
            $settings,
            $order,
            (string) $request->query('Authority', ''),
            (string) $request->query('Status', ''),
        );

        return redirect()->route('storefront.order', [
            'store' => $store, 'code' => $order->code, 'phone' => $order->customer_phone,
        ]);
    }

    /**
     * Order result / receipt page (looked up by code + phone).
     */
    public function order(Request $request, string $store, string $code): Response
    {
        $settings = $this->resolveStore($store);

        $order = Order::query()
            ->where('user_id', $settings->user_id)
            ->where('code', $code)
            ->where('customer_phone', $request->string('phone'))
            ->with(['items'])
            ->firstOrFail();

        return $this->render($settings, 'order', [
            'order' => OrderResource::make($order)->resolve(),
            'cardToCard' => $settings->card_to_card_enabled ? [
                'holder' => $settings->card_holder_name,
                'card' => $settings->card_number,
                'sheba' => $settings->sheba_number,
            ] : null,
        ]);
    }

    /**
     * Order tracking form.
     */
    public function track(string $store): Response
    {
        return $this->render($this->resolveStore($store), 'track', []);
    }

    /**
     * Look up an order by code + phone and redirect to its result page.
     */
    public function trackLookup(Request $request, string $store): RedirectResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
            'phone' => ['required', 'string'],
        ]);

        $settings = $this->resolveStore($store);

        $order = Order::query()
            ->where('user_id', $settings->user_id)
            ->where('code', $data['code'])
            ->where('customer_phone', $data['phone'])
            ->first();

        if ($order === null) {
            return back()->withErrors(['code' => 'سفارشی با این مشخصات یافت نشد.']);
        }

        return redirect()->route('storefront.order', [
            'store' => $store, 'code' => $order->code, 'phone' => $order->customer_phone,
        ]);
    }

    /**
     * Render a storefront page within the selected template, with shared store
     * props and SEO metadata.
     *
     * @param  array<string, mixed>  $props
     */
    protected function render(StoreSetting $settings, string $page, array $props): Response
    {
        $template = $settings->template ?: 'classic';

        return Inertia::render("storefront/{$template}/{$page}", array_merge([
            'store' => $this->storeProps($settings),
        ], $props));
    }

    /**
     * The payment methods this store can accept.
     *
     * @return array<int, array{value: string, label: string}>
     */
    protected function availablePaymentMethods(StoreSetting $settings): array
    {
        $methods = [];

        if ($this->storePayments->canUseZarinpal($settings)) {
            $methods[] = ['value' => OrderPaymentMethod::Online->value, 'label' => OrderPaymentMethod::Online->label()];
        }

        if ($settings->card_to_card_enabled) {
            $methods[] = ['value' => OrderPaymentMethod::BankTransfer->value, 'label' => OrderPaymentMethod::BankTransfer->label()];
        }

        $methods[] = ['value' => OrderPaymentMethod::CashOnDelivery->value, 'label' => OrderPaymentMethod::CashOnDelivery->label()];

        return $methods;
    }

    /**
     * The enabled shipping methods with their costs.
     *
     * @return array<int, array{value: string, label: string, intra_cost: int, inter_cost: int}>
     */
    protected function availableShippingMethods(StoreSetting $settings): array
    {
        return collect(StoreSettingService::SHIPPING_METHODS)
            ->filter(fn (string $method) => ($settings->shipping_methods[$method]['enabled'] ?? false))
            ->map(fn (string $method) => [
                'value' => $method,
                'label' => ShippingMethod::from($method)->label(),
                'intra_cost' => (int) ($settings->shipping_methods[$method]['intra_cost'] ?? 0),
                'inter_cost' => (int) ($settings->shipping_methods[$method]['inter_cost'] ?? 0),
            ])
            ->values()->all();
    }
}
