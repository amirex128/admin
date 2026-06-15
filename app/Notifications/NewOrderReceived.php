<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

/**
 * Notifies a seller that a new order (or pre-invoice) was registered for their
 * store.
 */
class NewOrderReceived extends Notification
{
    public function __construct(public Order $order) {}

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
            'title' => 'سفارش جدید',
            'body' => "سفارش {$this->order->code} برای «{$this->order->customer_name}» ثبت شد.",
            'url' => route('orders.show', $this->order),
            'icon' => 'shopping-cart',
        ];
    }
}
