<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

/**
 * Notifies a seller that a storefront customer requested a return for an order.
 */
class OrderReturnRequested extends Notification
{
    public function __construct(public Order $order, public string $reason) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'درخواست مرجوعی',
            'body' => "برای سفارش {$this->order->code} درخواست مرجوعی ثبت شد: {$this->reason}",
            'url' => route('orders.show', $this->order),
            'icon' => 'undo',
        ];
    }
}
