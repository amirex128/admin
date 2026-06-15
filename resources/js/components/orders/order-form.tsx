import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import InputError from '@/components/input-error';
import { Combobox } from '@/components/products/combobox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatToman } from '@/lib/format';
import type { OrderProductOption, SelectOption } from '@/types';

type ItemRow = {
    product_id: number | null;
    name: string;
    sales_unit: string | null;
    unit_price: string;
    quantity: string;
    discount_percent: string;
};

type OrderFormData = {
    user_id: number | null;
    customer_name: string;
    customer_phone: string;
    province: string;
    city: string;
    address: string;
    shipping_method: string;
    payment_method: string;
    payment_status: string;
    tax_percent: string;
    shipping_cost: string;
    status: string;
    note: string;
    items: ItemRow[];
};

const NONE = '__none__';

function lineTotal(item: ItemRow): number {
    const price = Number(item.unit_price) || 0;
    const qty = Number(item.quantity) || 0;
    const discount = Number(item.discount_percent) || 0;

    return Math.round((price * qty * (100 - discount)) / 100);
}

/**
 * Manual order / proforma creation form with an inline line-item editor and
 * live totals. Used by both the seller and admin (admin supplies a user
 * selector and the selected user id).
 */
export function OrderForm({
    products,
    submitUrl,
    shippingMethods,
    paymentMethods,
    paymentStatusOptions,
    requireUser = false,
    userId = null,
    userSelect,
}: {
    products: OrderProductOption[];
    submitUrl: string;
    shippingMethods: SelectOption[];
    paymentMethods: SelectOption[];
    paymentStatusOptions: SelectOption[];
    requireUser?: boolean;
    userId?: number | null;
    userSelect?: React.ReactNode;
}) {
    const form = useForm<OrderFormData>({
        user_id: userId,
        customer_name: '',
        customer_phone: '',
        province: '',
        city: '',
        address: '',
        shipping_method: '',
        payment_method: '',
        payment_status: 'unpaid',
        tax_percent: '0',
        shipping_cost: '0',
        status: 'awaiting_confirmation',
        note: '',
        items: [],
    });

    // Keep the payload's user id in sync when the admin picks a different seller.
    useEffect(() => {
        if (form.data.user_id !== userId) {
            form.setData('user_id', userId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const totals = useMemo(() => {
        const subtotal = form.data.items.reduce(
            (sum, item) => sum + lineTotal(item),
            0,
        );
        const taxPercent = Number(form.data.tax_percent) || 0;
        const taxAmount = Math.round((subtotal * taxPercent) / 100);
        const shipping = Number(form.data.shipping_cost) || 0;

        return { subtotal, taxAmount, total: subtotal + taxAmount + shipping };
    }, [form.data.items, form.data.tax_percent, form.data.shipping_cost]);

    function addProduct(productId: number | null) {
        if (productId === null) {
            return;
        }

        const product = products.find((item) => item.id === productId);

        if (!product) {
            return;
        }

        form.setData('items', [
            ...form.data.items,
            {
                product_id: product.id,
                name: product.name,
                sales_unit: product.sales_unit,
                unit_price: String(product.price),
                quantity: '1',
                discount_percent: '0',
            },
        ]);
    }

    function addManualItem() {
        form.setData('items', [
            ...form.data.items,
            {
                product_id: null,
                name: '',
                sales_unit: null,
                unit_price: '0',
                quantity: '1',
                discount_percent: '0',
            },
        ]);
    }

    function updateItem(index: number, patch: Partial<ItemRow>) {
        form.setData(
            'items',
            form.data.items.map((item, current) =>
                current === index ? { ...item, ...patch } : item,
            ),
        );
    }

    function removeItem(index: number) {
        form.setData(
            'items',
            form.data.items.filter((_, current) => current !== index),
        );
    }

    function submit(status: string) {
        form.transform((data) => ({ ...data, status }));
        form.post(submitUrl);
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                submit('awaiting_confirmation');
            }}
            className="grid gap-6 lg:grid-cols-3"
        >
            <div className="flex flex-col gap-6 lg:col-span-2">
                {(userSelect || requireUser) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>انتخاب کاربر</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {userSelect}
                            <InputError message={form.errors.user_id} />
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>اقلام سفارش</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="min-w-56 flex-1">
                                <Combobox
                                    options={products.map((product) => ({
                                        value: product.id,
                                        label: product.name,
                                        hint: `${formatToman(product.price)} تومان`,
                                    }))}
                                    value={null}
                                    onChange={addProduct}
                                    placeholder="افزودن از محصولات"
                                    searchPlaceholder="جستجوی محصول..."
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-1.5"
                                onClick={addManualItem}
                            >
                                <Plus className="size-4" />
                                ردیف دستی
                            </Button>
                        </div>

                        {form.data.items.length === 0 ? (
                            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                هنوز کالایی اضافه نشده است.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {form.data.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid gap-2 rounded-lg border p-3 sm:grid-cols-12"
                                    >
                                        <div className="sm:col-span-4">
                                            <Label className="text-xs text-muted-foreground">
                                                کالا
                                            </Label>
                                            <Input
                                                value={item.name}
                                                onChange={(event) =>
                                                    updateItem(index, {
                                                        name: event.target
                                                            .value,
                                                    })
                                                }
                                                placeholder="نام کالا"
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <Label className="text-xs text-muted-foreground">
                                                قیمت واحد
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={item.unit_price}
                                                onChange={(event) =>
                                                    updateItem(index, {
                                                        unit_price:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label className="text-xs text-muted-foreground">
                                                تعداد
                                            </Label>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    updateItem(index, {
                                                        quantity:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label className="text-xs text-muted-foreground">
                                                تخفیف ٪
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={item.discount_percent}
                                                onChange={(event) =>
                                                    updateItem(index, {
                                                        discount_percent:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end justify-between gap-2 sm:col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                        <div className="text-xs text-muted-foreground sm:col-span-12">
                                            جمع ردیف:{' '}
                                            <span className="font-medium text-foreground tabular-nums">
                                                {formatToman(lineTotal(item))}{' '}
                                                تومان
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <InputError message={form.errors.items} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>مشخصات سفارش‌دهنده</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="نام سفارش‌دهنده"
                            value={form.data.customer_name}
                            onChange={(value) =>
                                form.setData('customer_name', value)
                            }
                            error={form.errors.customer_name}
                            required
                        />
                        <Field
                            label="تلفن"
                            value={form.data.customer_phone}
                            onChange={(value) =>
                                form.setData('customer_phone', value)
                            }
                            error={form.errors.customer_phone}
                        />
                        <Field
                            label="استان"
                            value={form.data.province}
                            onChange={(value) =>
                                form.setData('province', value)
                            }
                            error={form.errors.province}
                        />
                        <Field
                            label="شهر"
                            value={form.data.city}
                            onChange={(value) => form.setData('city', value)}
                            error={form.errors.city}
                        />
                        <div className="grid gap-2 sm:col-span-2">
                            <Label>آدرس</Label>
                            <Textarea
                                value={form.data.address}
                                onChange={(event) =>
                                    form.setData('address', event.target.value)
                                }
                            />
                            <InputError message={form.errors.address} />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <Label>توضیحات</Label>
                            <Textarea
                                value={form.data.note}
                                onChange={(event) =>
                                    form.setData('note', event.target.value)
                                }
                            />
                            <InputError message={form.errors.note} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>حمل و پرداخت</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SelectField
                            label="روش ارسال"
                            value={form.data.shipping_method}
                            onChange={(value) =>
                                form.setData('shipping_method', value)
                            }
                            options={shippingMethods}
                        />
                        <SelectField
                            label="روش پرداخت"
                            value={form.data.payment_method}
                            onChange={(value) =>
                                form.setData('payment_method', value)
                            }
                            options={paymentMethods}
                        />
                        <div className="grid gap-2">
                            <Label>وضعیت پرداخت</Label>
                            <Select
                                value={form.data.payment_status}
                                onValueChange={(value) =>
                                    form.setData('payment_status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentStatusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>مبالغ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label>مالیات ٪</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.data.tax_percent}
                                    onChange={(event) =>
                                        form.setData(
                                            'tax_percent',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>هزینه ارسال</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.data.shipping_cost}
                                    onChange={(event) =>
                                        form.setData(
                                            'shipping_cost',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <dl className="space-y-1.5 text-sm">
                            <SummaryRow
                                label="جمع اقلام"
                                value={totals.subtotal}
                            />
                            <SummaryRow
                                label="مالیات"
                                value={totals.taxAmount}
                            />
                            <SummaryRow
                                label="هزینه ارسال"
                                value={Number(form.data.shipping_cost) || 0}
                            />
                            <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                                <dt>مبلغ کل</dt>
                                <dd className="tabular-nums">
                                    {formatToman(totals.total)} تومان
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                    <Button
                        type="submit"
                        disabled={
                            form.processing ||
                            form.data.items.length === 0 ||
                            (requireUser && !form.data.user_id)
                        }
                    >
                        ثبت سفارش
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={
                            form.processing ||
                            form.data.items.length === 0 ||
                            (requireUser && !form.data.user_id)
                        }
                        onClick={() => submit('proforma')}
                    >
                        صدور پیش‌فاکتور
                    </Button>
                </div>
            </div>
        </form>
    );
}

function Field({
    label,
    value,
    onChange,
    error,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
            />
            <InputError message={error} />
        </div>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Select
                value={value === '' ? NONE : value}
                onValueChange={(next) => onChange(next === NONE ? '' : next)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={NONE}>—</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between text-muted-foreground">
            <dt>{label}</dt>
            <dd className="tabular-nums">{formatToman(value)} تومان</dd>
        </div>
    );
}
