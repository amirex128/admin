<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Notifications\Notification;

/**
 * Notifies a seller that one of their products was rejected, including the
 * reason supplied by the admin.
 */
class ProductRejected extends Notification
{
    public function __construct(public Product $product, public string $reason) {}

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
            'title' => 'محصول رد شد',
            'body' => "محصول «{$this->product->name}» رد شد: {$this->reason}",
            'url' => route('products.index'),
            'icon' => 'x',
        ];
    }
}
