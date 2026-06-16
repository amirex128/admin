<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Concerns\ResolvesStorefront;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Storefront customer authentication (register / login / logout), scoped to a
 * single seller's store via the `customer` guard.
 */
class AuthController extends Controller
{
    use ResolvesStorefront;

    /**
     * Show the login page.
     */
    public function showLogin(string $store): Response
    {
        return $this->render($store, 'login');
    }

    /**
     * Show the registration page.
     */
    public function showRegister(string $store): Response
    {
        return $this->render($store, 'register');
    }

    /**
     * Authenticate a customer within the store.
     */
    public function login(Request $request, string $store): RedirectResponse
    {
        $settings = $this->resolveStore($store);

        $data = $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $customer = Customer::query()
            ->where('user_id', $settings->user_id)
            ->where('phone', $data['phone'])
            ->first();

        if ($customer === null || $customer->password === null || ! Hash::check($data['password'], $customer->password)) {
            throw ValidationException::withMessages([
                'phone' => 'شماره موبایل یا رمز عبور نادرست است.',
            ]);
        }

        if ($customer->isBlocked()) {
            throw ValidationException::withMessages([
                'phone' => 'حساب شما مسدود شده است.',
            ]);
        }

        Auth::guard('customer')->login($customer, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->route('storefront.account', ['store' => $store]);
    }

    /**
     * Register a new customer (or claim an existing guest record) for the store.
     */
    public function register(Request $request, string $store): RedirectResponse
    {
        $settings = $this->resolveStore($store);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $existing = Customer::query()
            ->where('user_id', $settings->user_id)
            ->where('phone', $data['phone'])
            ->first();

        if ($existing !== null && $existing->password !== null) {
            throw ValidationException::withMessages([
                'phone' => 'این شماره قبلاً ثبت‌نام کرده است. وارد شوید.',
            ]);
        }

        $customer = $existing ?? new Customer(['user_id' => $settings->user_id]);
        $customer->user_id = $settings->user_id;
        $customer->name = $data['name'];
        $customer->phone = $data['phone'];
        $customer->password = $data['password'];
        $customer->save();

        Auth::guard('customer')->login($customer);
        $request->session()->regenerate();

        return redirect()->route('storefront.account', ['store' => $store]);
    }

    /**
     * Log the customer out.
     */
    public function logout(Request $request, string $store): RedirectResponse
    {
        Auth::guard('customer')->logout();
        $request->session()->regenerate();

        return redirect()->route('storefront.home', ['store' => $store]);
    }

    /**
     * Render a storefront auth page within the store's template.
     */
    protected function render(string $store, string $page): Response
    {
        $settings = $this->resolveStore($store);
        $template = $settings->template ?: 'classic';

        return Inertia::render("storefront/{$template}/auth/{$page}", [
            'store' => $this->storeProps($settings),
        ]);
    }
}
