import { Link, router, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import { formatToman } from '@/lib/format';
import { useCart } from '@/lib/storefront-cart';
import type { GeoOption, StorefrontStore } from '@/types';

const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none';

type PaymentMethod = { value: string; label: string };
type ShippingMethod = {
    value: string;
    label: string;
    intra_cost: number;
    inter_cost: number;
};

type PageProps = {
    store: StorefrontStore;
    provinces: GeoOption[];
    cities: GeoOption[];
    paymentMethods: PaymentMethod[];
    shippingMethods: ShippingMethod[];
    cardToCard: { holder: string; card: string; sheba: string } | null;
};

export default function StorefrontCheckout({
    store,
    provinces,
    cities,
    paymentMethods,
    shippingMethods,
}: PageProps) {
    const { items, total } = useCart(store.key);

    const form = useForm({
        customer_name: '',
        customer_phone: '',
        province_id: '' as string,
        city_id: '' as string,
        address: '',
        shipping_method: shippingMethods[0]?.value ?? '',
        payment_method: paymentMethods[0]?.value ?? 'cash_on_delivery',
    });

    function changeProvince(value: string) {
        form.setData('province_id', value);
        form.setData('city_id', '');
        router.reload({
            only: ['cities'],
            data: { province_id: value || undefined },
        });
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            province_id: data.province_id || null,
            city_id: data.city_id || null,
            items: items.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
        }));
        form.post(shopUrl(store.key, '/checkout'));
    }

    if (items.length === 0) {
        return (
            <StorefrontLayout store={store} title="تکمیل خرید">
                <div className="py-16 text-center text-neutral-500">
                    سبد خرید شما خالی است.{' '}
                    <Link
                        href={shopUrl(store.key)}
                        className="text-primary hover:underline"
                    >
                        بازگشت به فروشگاه
                    </Link>
                </div>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout store={store} title="تکمیل خرید">
            <h1 className="mb-5 text-xl font-bold">تکمیل خرید</h1>

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2">
                        <Field label="نام و نام خانوادگی" error={form.errors.customer_name}>
                            <input
                                className={inputClass}
                                value={form.data.customer_name}
                                onChange={(e) =>
                                    form.setData('customer_name', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="شماره موبایل" error={form.errors.customer_phone}>
                            <input
                                className={inputClass}
                                dir="ltr"
                                value={form.data.customer_phone}
                                onChange={(e) =>
                                    form.setData(
                                        'customer_phone',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="استان">
                            <select
                                className={inputClass}
                                value={form.data.province_id}
                                onChange={(e) =>
                                    changeProvince(e.target.value)
                                }
                            >
                                <option value="">انتخاب استان</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="شهر">
                            <select
                                className={inputClass}
                                value={form.data.city_id}
                                onChange={(e) =>
                                    form.setData('city_id', e.target.value)
                                }
                                disabled={cities.length === 0}
                            >
                                <option value="">انتخاب شهر</option>
                                {cities.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <div className="sm:col-span-2">
                            <Field label="آدرس" error={form.errors.address}>
                                <textarea
                                    className={inputClass}
                                    rows={2}
                                    value={form.data.address}
                                    onChange={(e) =>
                                        form.setData('address', e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </div>

                    {shippingMethods.length > 0 && (
                        <div className="rounded-xl border bg-white p-4">
                            <p className="mb-3 text-sm font-medium">روش ارسال</p>
                            <div className="space-y-2">
                                {shippingMethods.map((method) => (
                                    <label
                                        key={method.value}
                                        className="flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-sm"
                                    >
                                        <span className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="shipping_method"
                                                checked={
                                                    form.data.shipping_method ===
                                                    method.value
                                                }
                                                onChange={() =>
                                                    form.setData(
                                                        'shipping_method',
                                                        method.value,
                                                    )
                                                }
                                            />
                                            {method.label}
                                        </span>
                                        <span className="text-neutral-500">
                                            از {formatToman(method.intra_cost)}{' '}
                                            تومان
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border bg-white p-4">
                        <p className="mb-3 text-sm font-medium">روش پرداخت</p>
                        <div className="space-y-2">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.value}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm"
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        checked={
                                            form.data.payment_method ===
                                            method.value
                                        }
                                        onChange={() =>
                                            form.setData(
                                                'payment_method',
                                                method.value,
                                            )
                                        }
                                    />
                                    {method.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-fit space-y-4 rounded-xl border bg-white p-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">جمع سبد</span>
                        <span className="font-bold">
                            {formatToman(total)} تومان
                        </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                        هزینه ارسال و مالیات بر ارزش افزوده هنگام ثبت سفارش محاسبه
                        و افزوده می‌شود.
                    </p>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    >
                        {form.processing && (
                            <Loader2 className="size-4 animate-spin" />
                        )}
                        ثبت سفارش
                    </button>
                </div>
            </form>
        </StorefrontLayout>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm">{label}</label>
            {children}
            {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
    );
}
