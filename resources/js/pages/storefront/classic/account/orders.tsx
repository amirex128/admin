import { Link } from '@inertiajs/react';

import { AccountNav } from '@/components/storefront/account-nav';
import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import { Badge } from '@/components/ui/badge';
import { formatToman } from '@/lib/format';
import { formatJalaali } from '@/lib/jalali';
import type { Order, Paginated, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    orders: Paginated<Order>;
};

export default function AccountOrders({ store, orders }: PageProps) {
    return (
        <StorefrontLayout store={store} title="سفارش‌های من">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <AccountNav store={store} active="orders" />

                <div className="space-y-3">
                    <h1 className="text-xl font-bold">سفارش‌های من</h1>

                    {orders.data.length === 0 && (
                        <p className="rounded-xl border bg-white py-12 text-center text-neutral-500">
                            سفارشی ثبت نکرده‌اید.
                        </p>
                    )}

                    {orders.data.map((order) => (
                        <Link
                            key={order.id}
                            href={shopUrl(
                                store.key,
                                `/account/orders/${order.code}`,
                            )}
                            className="flex items-center justify-between rounded-xl border bg-white p-4 hover:border-primary"
                        >
                            <div>
                                <p className="font-medium" dir="ltr">
                                    {order.code}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {formatJalaali(order.created_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary">
                                    {order.status_label}
                                </Badge>
                                <span className="text-sm font-bold">
                                    {formatToman(order.total)} تومان
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </StorefrontLayout>
    );
}
