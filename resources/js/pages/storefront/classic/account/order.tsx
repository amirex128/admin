import { useForm } from '@inertiajs/react';
import { Loader2, Undo2 } from 'lucide-react';

import { AccountNav } from '@/components/storefront/account-nav';
import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formatToman } from '@/lib/format';
import { formatJalaali } from '@/lib/jalali';
import type { Order, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    order: Order;
};

export default function AccountOrder({ store, order }: PageProps) {
    const canReturn = order.status === 'delivered';

    return (
        <StorefrontLayout store={store} title={`سفارش ${order.code}`}>
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <AccountNav store={store} active="orders" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold" dir="ltr">
                            {order.code}
                        </h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {order.status_label}
                            </Badge>
                            {canReturn && (
                                <ReturnRequestDialog store={store} order={order} />
                            )}
                        </div>
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

                    {order.status === 'return_requested' && (
                        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                            درخواست مرجوعی شما ثبت شده و در حال بررسی است.
                        </p>
                    )}

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

function ReturnRequestDialog({
    store,
    order,
}: {
    store: StorefrontStore;
    order: Order;
}) {
    const form = useForm({ reason: '' });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(shopUrl(store.key, `/account/orders/${order.code}/return`), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                    <Undo2 className="size-4" />
                    درخواست مرجوعی
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>درخواست مرجوعی</DialogTitle>
                    <DialogDescription>
                        دلیل درخواست مرجوعی سفارش {order.code} را بنویسید.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-3">
                    <Textarea
                        value={form.data.reason}
                        onChange={(e) => form.setData('reason', e.target.value)}
                        rows={3}
                        placeholder="مثلاً کالا معیوب بود."
                    />
                    {form.errors.reason && (
                        <p className="text-xs text-rose-600">
                            {form.errors.reason}
                        </p>
                    )}
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="gap-1.5"
                        >
                            {form.processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            ثبت درخواست
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
