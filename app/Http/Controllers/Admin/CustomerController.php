<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CustomerStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCustomerRequest;
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
     * Display every customer across the platform with an owner filter.
     */
    public function index(Request $request): Response
    {
        $query = Customer::query()
            ->with('user:id,name')
            ->withCount('orders')
            ->withSum('orders as orders_sum_total', 'total')
            ->when($request->string('user')->toString(), function ($q, string $owner): void {
                $q->whereHas('user', function ($u) use ($owner): void {
                    $u->where('name', 'like', "%{$owner}%")->orWhere('id', $owner);
                });
            });

        $this->customers->applyFilters($query, [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
        ]);

        $customers = $query
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Customer $customer) => CustomerResource::make($customer)->resolve());

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'statuses' => CustomerStatus::options(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString() ?: null,
                'user' => $request->string('user')->toString(),
            ],
        ]);
    }

    /**
     * Update the given customer on behalf of its owner.
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
        $customer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'مشتری حذف شد.']);

        return back();
    }
}
