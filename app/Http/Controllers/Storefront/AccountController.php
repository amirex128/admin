<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Concerns\ResolvesStorefront;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Models\Order;
use App\Models\StoreSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

/**
 * The storefront customer panel: order history, order detail, profile and
 * password management. Access is scoped to the customer's own store.
 */
class AccountController extends Controller
{
    use ResolvesStorefront;

    /**
     * The customer's order history.
     */
    public function orders(Request $request, string $store): Response|RedirectResponse
    {
        $settings = $this->resolveStore($store);
        $customer = $this->currentCustomer($settings);

        if ($customer === null) {
            return redirect()->route('storefront.login', ['store' => $store]);
        }

        $orders = Order::query()
            ->where('user_id', $settings->user_id)
            ->where('customer_id', $customer->id)
            ->withCount('items')
            ->latest('id')
            ->paginate(10)
            ->through(fn (Order $order) => OrderResource::make($order)->resolve());

        return $this->render($settings, 'account/orders', ['orders' => $orders]);
    }

    /**
     * A single order belonging to the customer.
     */
    public function order(Request $request, string $store, string $code): Response|RedirectResponse
    {
        $settings = $this->resolveStore($store);
        $customer = $this->currentCustomer($settings);

        if ($customer === null) {
            return redirect()->route('storefront.login', ['store' => $store]);
        }

        $order = Order::query()
            ->where('user_id', $settings->user_id)
            ->where('customer_id', $customer->id)
            ->where('code', $code)
            ->with(['items', 'statusHistories'])
            ->firstOrFail();

        return $this->render($settings, 'account/order', [
            'order' => OrderResource::make($order)->resolve(),
        ]);
    }

    /**
     * The customer's profile form.
     */
    public function profile(Request $request, string $store): Response|RedirectResponse
    {
        $settings = $this->resolveStore($store);
        $customer = $this->currentCustomer($settings);

        if ($customer === null) {
            return redirect()->route('storefront.login', ['store' => $store]);
        }

        return $this->render($settings, 'account/profile', [
            'customer' => [
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'province' => $customer->province,
                'city' => $customer->city,
                'address' => $customer->address,
            ],
        ]);
    }

    /**
     * Update the customer's profile.
     */
    public function updateProfile(Request $request, string $store): RedirectResponse
    {
        $settings = $this->resolveStore($store);
        $customer = $this->currentCustomer($settings);

        abort_if($customer === null, HttpResponse::HTTP_FORBIDDEN);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
        ]);

        $customer->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'اطلاعات بروزرسانی شد.']);

        return back();
    }

    /**
     * Update the customer's password.
     */
    public function updatePassword(Request $request, string $store): RedirectResponse
    {
        $settings = $this->resolveStore($store);
        $customer = $this->currentCustomer($settings);

        abort_if($customer === null, HttpResponse::HTTP_FORBIDDEN);

        $data = $request->validate([
            'current_password' => ['nullable', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if ($customer->password !== null && ! Hash::check((string) $data['current_password'], $customer->password)) {
            return back()->withErrors(['current_password' => 'رمز عبور فعلی نادرست است.']);
        }

        $customer->update(['password' => $data['password']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'رمز عبور تغییر کرد.']);

        return back();
    }

    /**
     * The currently authenticated customer if they belong to this store.
     */
    protected function currentCustomer(StoreSetting $settings): ?Customer
    {
        $customer = Auth::guard('customer')->user();

        return ($customer instanceof Customer && $customer->user_id === $settings->user_id)
            ? $customer
            : null;
    }

    /**
     * Render a storefront account page within the store's template.
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
}
