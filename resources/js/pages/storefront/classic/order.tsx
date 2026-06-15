import { Link } from '@inertiajs/react';
import { CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { useEffect } from 'react';

import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import { formatToman } from '@/lib/format';
import { useCart } from '@/lib/storefront-cart';
import type { Order, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    order: Order;
    cardToCard: { holder: string; card: string; sheba: string } | null;
};

export default function StorefrontOrder({
    store,
    order,
    cardToCard,
}: PageProps) {
    const { clear } = useCart(store.key);
    const paid = order.payment_status === 'paid';

    // The order is placed; empty the cart.
    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <StorefrontLayout store={store} title={`سفارش ${order.code}`}>
            <div className="mx-auto max-w-2xl space-y-5">
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-6 text-center">
                    {paid ? (
                        <CheckCircle2 className="size-12 text-emerald-500" />
                    ) : (
                        <Clock className="size-12 text-amber-500" />
                    )}
                    <h1 className="text-lg font-bold">
                        سفارش شما با کد {order.code} ثبت شد
                    </h1>
                    <p className="text-sm text-neutral-500">
                        وضعیت: {order.status_label} — پرداخت:{' '}
                        {order.payment_status_label}
                    </p>
                </div>

                <div className="rounded-2xl border bg-white p-4">
                    <h2 className="mb-3 text-sm font-semibold">اقلام سفارش</h2>
                    <ul className="divide-y text-sm">
                        {order.items?.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between py-2"
                            >
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="tabular-nums">
                                    {formatToman(item.total)} تومان
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 space-y-1 border-t pt-3 text-sm">
                        <Row label="جمع کل" value={order.subtotal} />
                        <Row label="مالیات" value={order.tax_amount} />
                        <Row label="ارسال" value={order.shipping_cost} />
                        <div className="flex justify-between pt-1 font-bold">
                            <span>مبلغ نهایی</span>
                            <span>{formatToman(order.total)} تومان</span>
                        </div>
                    </div>
                </div>

                {!paid && cardToCard && (
                    <div className="space-y-2 rounded-2xl border bg-white p-4">
                        <h2 className="flex items-center gap-2 text-sm font-semibold">
                            <CreditCard className="size-4" />
                            اطلاعات پرداخت کارت به کارت
                        </h2>
                        <p className="text-sm" dir="ltr">
                            {cardToCard.card}
                        </p>
                        <p className="text-sm text-neutral-500">
                            به نام {cardToCard.holder}
                        </p>
                    </div>
                )}

                <div className="text-center">
                    <Link
                        href={shopUrl(store.key)}
                        className="text-sm text-primary hover:underline"
                    >
                        بازگشت به فروشگاه
                    </Link>
                </div>
            </div>
        </StorefrontLayout>
    );
}

function Row({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between text-neutral-500">
            <span>{label}</span>
            <span className="tabular-nums">{formatToman(value)} تومان</span>
        </div>
    );
}
