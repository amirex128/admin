<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Services\Payment\GatewayException;
use App\Services\Payment\PaymentService;
use App\Services\Wallet\InsufficientBalanceException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    /**
     * List every gateway payment with filtering by owner and status.
     */
    public function index(Request $request): Response
    {
        $payments = Payment::query()
            ->with('user')
            ->when($request->string('search')->toString(), function ($query, string $search): void {
                $query->where(fn ($q) => $q->where('ref_id', 'like', "%{$search}%")
                    ->orWhere('authority', 'like', "%{$search}%"));
            })
            ->when($request->string('user')->toString(), function ($query, string $user): void {
                $query->whereHas('user', function ($q) use ($user): void {
                    $q->where('name', 'like', "%{$user}%")
                        ->orWhere('phone', 'like', "%{$user}%")
                        ->orWhere('id', $user);
                });
            })
            ->when($request->enum('status', PaymentStatus::class), fn ($query, PaymentStatus $status) => $query->withStatus($status))
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Payment $payment) => PaymentResource::make($payment)->resolve());

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'statuses' => array_map(
                static fn (PaymentStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
                PaymentStatus::cases(),
            ),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'user' => $request->string('user')->toString(),
                'status' => $request->string('status')->toString() ?: null,
            ],
        ]);
    }

    /**
     * Reverse a payment within the settlement window (under 30 minutes).
     */
    public function reverse(Payment $payment): RedirectResponse
    {
        return $this->run(fn () => $this->paymentService->reverse($payment, request()->user()), 'تراکنش با موفقیت ریورس شد.');
    }

    /**
     * Refund a settled payment (after the reversal window).
     */
    public function refund(Payment $payment): RedirectResponse
    {
        return $this->run(fn () => $this->paymentService->refund($payment, request()->user()), 'وجه با موفقیت مسترد شد.');
    }

    /**
     * Inquire about a payment's status at the gateway.
     */
    public function inquiry(Payment $payment): RedirectResponse
    {
        try {
            $result = $this->paymentService->inquiry($payment);
        } catch (GatewayException $exception) {
            return back()->withErrors(['gateway' => $exception->getMessage()]);
        }

        Inertia::flash('toast', [
            'type' => 'info',
            'message' => "وضعیت تراکنش: {$result['status']} (کد {$result['code']})",
        ]);

        return back();
    }

    /**
     * Fetch the list of paid-but-unverified transactions from the gateway.
     */
    public function unverified(): JsonResponse
    {
        try {
            return response()->json(['authorities' => $this->paymentService->unverified()]);
        } catch (GatewayException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    /**
     * Run a gateway action, translating failures into form errors.
     */
    protected function run(callable $action, string $successMessage): RedirectResponse
    {
        try {
            $action();
        } catch (InsufficientBalanceException) {
            return back()->withErrors(['gateway' => 'موجودی کیف پول کاربر برای برگشت کافی نیست.']);
        } catch (GatewayException|RuntimeException $exception) {
            return back()->withErrors(['gateway' => $exception->getMessage()]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => $successMessage]);

        return back();
    }
}
