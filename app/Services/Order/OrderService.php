<?php

namespace App\Services\Order;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use App\Notifications\NewOrderReceived;
use App\Services\Customer\CustomerService;
use App\Services\Store\StoreSettingService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Encapsulates the order lifecycle: manual creation, total calculation and
 * status transitions with an auditable history trail.
 */
class OrderService
{
    public function __construct(
        private readonly StoreSettingService $storeSettings,
        private readonly CustomerService $customers,
    ) {}

    /**
     * Create an order (or pre-invoice/proforma) for the given seller.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(User $owner, array $data, ?User $performedBy = null): Order
    {
        return DB::transaction(function () use ($owner, $data, $performedBy): Order {
            $items = $this->normalizeItems($data['items'] ?? []);
            $taxPercent = array_key_exists('tax_percent', $data) && $data['tax_percent'] !== null
                ? (int) $data['tax_percent']
                : $this->storeSettings->forUser($owner)->vat_percent;
            $shippingCost = (int) ($data['shipping_cost'] ?? 0);
            $totals = $this->calculateTotals($items, $taxPercent, $shippingCost);

            $rawStatus = $data['status'] ?? OrderStatus::Proforma->value;
            $status = $rawStatus instanceof OrderStatus ? $rawStatus : OrderStatus::from($rawStatus);

            $rawPaymentStatus = $data['payment_status'] ?? OrderPaymentStatus::Unpaid->value;
            $paymentStatus = $rawPaymentStatus instanceof OrderPaymentStatus
                ? $rawPaymentStatus
                : OrderPaymentStatus::from($rawPaymentStatus);

            // Every order/pre-invoice is tied to a CRM customer record so the
            // seller builds up a customer book automatically.
            $customer = $this->customers->findOrCreateForOrder($owner, $data);

            /** @var Order $order */
            $order = $owner->orders()->create([
                'customer_id' => $customer->id,
                'code' => $this->generateCode(),
                'status' => $status,
                'payment_status' => $paymentStatus,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'] ?? null,
                'province' => $data['province'] ?? null,
                'city' => $data['city'] ?? null,
                'address' => $data['address'] ?? null,
                'shipping_method' => $data['shipping_method'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'tracking_code' => $data['tracking_code'] ?? null,
                'subtotal' => $totals['subtotal'],
                'tax_percent' => $taxPercent,
                'tax_amount' => $totals['tax_amount'],
                'shipping_cost' => $shippingCost,
                'total' => $totals['total'],
                'note' => $data['note'] ?? null,
                'paid_at' => $paymentStatus === OrderPaymentStatus::Paid ? now() : null,
            ]);

            foreach ($items as $item) {
                $order->items()->create($item);
            }

            $this->recordHistory($order, $status, $data['note'] ?? null, $performedBy);

            $owner->notify(new NewOrderReceived($order));

            return $order;
        });
    }

    /**
     * Move the order to a new status, recording history and stamping the
     * relevant fulfilment timestamps.
     */
    public function updateStatus(
        Order $order,
        OrderStatus $status,
        ?string $note = null,
        ?string $trackingCode = null,
        ?User $performedBy = null,
    ): Order {
        return DB::transaction(function () use ($order, $status, $note, $trackingCode, $performedBy): Order {
            $attributes = ['status' => $status];

            if ($trackingCode !== null && $trackingCode !== '') {
                $attributes['tracking_code'] = $trackingCode;
            }

            if ($status === OrderStatus::Shipping && $order->shipped_at === null) {
                $attributes['shipped_at'] = now();
            }

            if ($status === OrderStatus::Delivered && $order->delivered_at === null) {
                $attributes['delivered_at'] = now();
            }

            $order->update($attributes);

            $this->recordHistory($order, $status, $note, $performedBy);

            return $order->refresh();
        });
    }

    /**
     * Update the payment status of the order (e.g. when the customer settles
     * the amount due).
     */
    public function markPayment(Order $order, OrderPaymentStatus $status): Order
    {
        $order->update([
            'payment_status' => $status,
            'paid_at' => $status === OrderPaymentStatus::Paid ? ($order->paid_at ?? now()) : null,
        ]);

        return $order;
    }

    /**
     * Normalize raw item rows into persistable order item attributes.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeItems(array $rows): array
    {
        $items = [];

        foreach ($rows as $row) {
            $unitPrice = max(0, (int) ($row['unit_price'] ?? 0));
            $quantity = max(1, (int) ($row['quantity'] ?? 1));
            $discountPercent = min(100, max(0, (int) ($row['discount_percent'] ?? 0)));
            $total = (int) round($unitPrice * $quantity * (100 - $discountPercent) / 100);

            $items[] = [
                'product_id' => $row['product_id'] ?? null,
                'name' => $row['name'],
                'sales_unit' => $row['sales_unit'] ?? null,
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'discount_percent' => $discountPercent,
                'total' => $total,
            ];
        }

        return $items;
    }

    /**
     * Calculate the monetary totals for a set of normalized items.
     *
     * @param  array<int, array<string, mixed>>  $items
     * @return array{subtotal: int, tax_amount: int, total: int}
     */
    protected function calculateTotals(array $items, int $taxPercent, int $shippingCost): array
    {
        $subtotal = array_sum(array_map(static fn (array $item): int => (int) $item['total'], $items));
        $taxAmount = (int) round($subtotal * max(0, $taxPercent) / 100);
        $total = $subtotal + $taxAmount + max(0, $shippingCost);

        return [
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total' => $total,
        ];
    }

    /**
     * Append a status history entry for the order.
     */
    protected function recordHistory(Order $order, OrderStatus $status, ?string $note, ?User $performedBy): void
    {
        $order->statusHistories()->create([
            'status' => $status,
            'note' => $note,
            'performed_by' => $performedBy?->id,
        ]);
    }

    /**
     * Generate a unique, human-friendly order code.
     */
    protected function generateCode(): string
    {
        do {
            $code = 'ORD-'.Str::upper(Str::random(8));
        } while (Order::query()->where('code', $code)->exists());

        return $code;
    }
}
