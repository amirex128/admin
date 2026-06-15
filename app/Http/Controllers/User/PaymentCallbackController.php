<?php

namespace App\Http\Controllers\User;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Services\Payment\GatewayException;
use App\Services\Payment\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentCallbackController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    /**
     * Handle the gateway return: verify the payment and flash the outcome.
     *
     * ZarinPal returns the `Authority` and `Status` query parameters.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $authority = (string) $request->query('Authority', '');
        $status = (string) $request->query('Status', '');

        if ($authority === '') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'اطلاعات بازگشتی از درگاه نامعتبر است.']);

            return to_route('wallet.index');
        }

        try {
            $payment = $this->paymentService->handleCallback($authority, $status);
        } catch (GatewayException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return to_route('wallet.index');
        }

        if ($payment->status === PaymentStatus::Paid) {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => "پرداخت موفق بود. کد پیگیری: {$payment->ref_id}",
            ]);
        } else {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'پرداخت ناموفق بود یا لغو شد.']);
        }

        return to_route('wallet.index');
    }
}
