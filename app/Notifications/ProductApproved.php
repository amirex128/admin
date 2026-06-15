<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Notifications\Notification;

/**
 * Notifies a seller that one of their products was approved by an admin.
 */
class ProductApproved extends Notification
{
    public function __construct(public Product $product) {}

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
            'title' => 'محصول تأیید شد',
            'body' => "محصول «{$this->product->name}» توسط مدیر تأیید شد.",
            'url' => route('products.index'),
            'icon' => 'check',
        ];
    }
}
