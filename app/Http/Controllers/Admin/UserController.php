<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Http\Resources\WalletTransactionResource;
use App\Models\User;
use App\Services\Wallet\WalletService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly WalletService $walletService) {}

    /**
     * Display a searchable, paginated list of all users.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->value();

        $users = User::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->with('wallet')
            ->withCount('subscriptions')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'balance' => $user->wallet?->balance ?? 0,
                'subscriptions_count' => $user->subscriptions_count,
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Display the management hub for a single user.
     */
    public function show(Request $request, User $user): Response
    {
        $transactions = $user->walletTransactions()
            ->with('performer:id,name')
            ->latest()
            ->paginate(10, ['*'], 'transactions')
            ->withQueryString()
            ->through(fn ($transaction) => WalletTransactionResource::make($transaction)->resolve());

        $subscriptions = $user->subscriptions()
            ->with('plan')
            ->latest()
            ->get();

        return Inertia::render('admin/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'referral_code' => $user->referral_code,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
            'balance' => $this->walletService->balance($user),
            'transactions' => $transactions,
            'subscriptions' => SubscriptionResource::collection($subscriptions),
        ]);
    }
}
