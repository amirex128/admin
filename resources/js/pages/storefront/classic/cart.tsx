import { Link } from '@inertiajs/react';
import { ImageOff, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import { formatToman } from '@/lib/format';
import { useCart } from '@/lib/storefront-cart';
import type { StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
};

export default function StorefrontCart({ store }: PageProps) {
    const { items, setQuantity, remove, total } = useCart(store.key);

    return (
        <StorefrontLayout store={store} title="سبد خرید">
            <h1 className="mb-5 text-xl font-bold">سبد خرید</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border bg-white py-16 text-neutral-500">
                    <ShoppingCart className="size-10" />
                    <p>سبد خرید شما خالی است.</p>
                    <Link
                        href={shopUrl(store.key)}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        مشاهده محصولات
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-3 lg:col-span-2">
                        {items.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex items-center gap-3 rounded-xl border bg-white p-3"
                            >
                                <div className="size-16 overflow-hidden rounded-lg bg-neutral-100">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-neutral-400">
                                            <ImageOff className="size-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-primary">
                                        {formatToman(item.price)} تومان
                                    </p>
                                </div>
                                <div className="flex items-center rounded-lg border">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity(
                                                item.product_id,
                                                item.quantity - 1,
                                            )
                                        }
                                        className="p-2"
                                    >
                                        <Minus className="size-4" />
                                    </button>
                                    <span className="w-8 text-center tabular-nums">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity(
                                                item.product_id,
                                                item.quantity + 1,
                                            )
                                        }
                                        className="p-2"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(item.product_id)}
                                    className="p-2 text-rose-600"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="h-fit space-y-4 rounded-xl border bg-white p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">جمع سبد</span>
                            <span className="font-bold">
                                {formatToman(total)} تومان
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                            هزینه ارسال و مالیات در مرحله پرداخت محاسبه می‌شود.
                        </p>
                        <Link
                            href={shopUrl(store.key, '/checkout')}
                            className="block rounded-lg bg-primary py-2.5 text-center text-primary-foreground hover:opacity-90"
                        >
                            ادامه و تکمیل خرید
                        </Link>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}
