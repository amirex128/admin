<?php

namespace App\Http\Controllers\User;

use App\Enums\CustomerStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreCustomerRequest;
use App\Http\Requests\User\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\Customer\CustomerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(private readonly CustomerService $customers) {}

    /**
     * Display the seller's customers.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Customer::query()
            ->ownedBy($user)
            ->withCount('orders')
            ->withSum('orders as orders_sum_total', 'total');

        $this->customers->applyFilters($query, [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
        ]);

        $customers = $query
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Customer $customer) => CustomerResource::make($customer)->resolve());

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'statuses' => CustomerStatus::options(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString() ?: null,
            ],
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $request->user()->customers()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مشتری ایجاد شد.']);

        return back();
    }

    /**
     * Update the given customer.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مشتری بروزرسانی شد.']);

        return back();
    }

    /**
     * Toggle the blocked state of the customer.
     */
    public function toggleBlock(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('update', $customer);

        $customer->update([
            'status' => $customer->isBlocked() ? CustomerStatus::Active : CustomerStatus::Blocked,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $customer->isBlocked() ? 'مشتری مسدود شد.' : 'مشتری فعال شد.',
        ]);

        return back();
    }

    /**
     * Remove the given customer.
     */
    public function destroy(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('delete', $customer);

        $customer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مشتری حذف شد.']);

        return back();
    }
}
