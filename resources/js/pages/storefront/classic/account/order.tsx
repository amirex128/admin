import { AccountNav } from '@/components/storefront/account-nav';
import { StorefrontLayout } from '@/components/storefront/storefront-layout';
import { Badge } from '@/components/ui/badge';
import { formatToman } from '@/lib/format';
import { formatJalaali } from '@/lib/jalali';
import type { Order, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    order: Order;
};

export default function AccountOrder({ store, order }: PageProps) {
    return (
        <StorefrontLayout store={store} title={`سفارش ${order.code}`}>
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <AccountNav store={store} active="orders" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold" dir="ltr">
                            {order.code}
                        </h1>
                        <Badge variant="secondary">{order.status_label}</Badge>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
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
                        <div className="mt-3 space-y-1 border-t pt-3 text-sm text-neutral-500">
                            <div className="flex justify-between">
                                <span>مالیات</span>
                                <span>{formatToman(order.tax_amount)} تومان</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ارسال</span>
                                <span>
                                    {formatToman(order.shipping_cost)} تومان
                                </span>
                            </div>
                            <div className="flex justify-between pt-1 font-bold text-neutral-900">
                                <span>مبلغ نهایی</span>
                                <span>{formatToman(order.total)} تومان</span>
                            </div>
                        </div>
                    </div>

                    {order.histories && order.histories.length > 0 && (
                        <div className="rounded-xl border bg-white p-4">
                            <h2 className="mb-3 text-sm font-semibold">
                                روند سفارش
                            </h2>
                            <ul className="space-y-2 text-sm">
                                {order.histories.map((history) => (
                                    <li
                                        key={history.id}
                                        className="flex justify-between text-neutral-600"
                                    >
                                        <span>{history.status_label}</span>
                                        <span className="text-xs">
                                            {formatJalaali(history.created_at)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
