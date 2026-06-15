import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { ProductMultiselect } from '@/components/coupons/product-multiselect';
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
import { Input } from '@/components/ui/input';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Coupon, DiscountTypeOption, GeoOption } from '@/types';

type Props = {
    trigger: React.ReactNode;
    discountTypes: DiscountTypeOption[];
    products: GeoOption[];
    submitUrl: string;
    method: 'post' | 'put';
    coupon?: Coupon;
};

/**
 * Create/edit dialog for a discount coupon with a Jalali validity window and
 * product targeting (all products or a specific multi-select).
 */
export function CouponFormDialog({
    trigger,
    discountTypes,
    products,
    submitUrl,
    method,
    coupon,
}: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, submit, processing, errors, reset, clearErrors } =
        useForm({
            code: coupon?.code ?? '',
            type: coupon?.type ?? discountTypes[0]?.value ?? 'percentage',
            value: coupon?.value ?? 0,
            min_order_amount: coupon?.min_order_amount ?? '',
            max_discount_amount: coupon?.max_discount_amount ?? '',
            usage_limit: coupon?.usage_limit ?? '',
            applies_to_all: coupon?.applies_to_all ?? true,
            starts_at: coupon?.starts_at ?? null,
            ends_at: coupon?.ends_at ?? null,
            is_active: coupon?.is_active ?? true,
            product_ids: coupon?.product_ids ?? [],
        });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        submit(method, submitUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);

                if (method === 'post') {
                    reset();
                }
            },
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (!next) {
                    clearErrors();

                    if (method === 'post') {
                        reset();
                    }
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {coupon ? 'ویرایش کد تخفیف' : 'کد تخفیف جدید'}
                    </DialogTitle>
                    <DialogDescription>
                        نوع و مقدار تخفیف، بازه اعتبار (تقویم شمسی) و محصولات هدف
                        را مشخص کنید.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="کد تخفیف" required error={errors.code}>
                            <Input
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value.toUpperCase())
                                }
                                placeholder="مثلاً NOWRUZ1403"
                                dir="ltr"
                            />
                        </Field>
                        <Field label="نوع تخفیف" error={errors.type}>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {discountTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label={
                                data.type === 'percentage'
                                    ? 'درصد تخفیف'
                                    : 'مبلغ تخفیف (تومان)'
                            }
                            required
                            error={errors.value}
                        >
                            <Input
                                type="number"
                                value={data.value}
                                onChange={(e) =>
                                    setData('value', Number(e.target.value))
                                }
                                min={0}
                            />
                        </Field>
                        <Field
                            label="حداقل مبلغ سفارش (تومان)"
                            error={errors.min_order_amount}
                        >
                            <Input
                                type="number"
                                value={data.min_order_amount}
                                onChange={(e) =>
                                    setData('min_order_amount', e.target.value)
                                }
                                min={0}
                            />
                        </Field>
                        <Field
                            label="سقف تخفیف (تومان)"
                            error={errors.max_discount_amount}
                        >
                            <Input
                                type="number"
                                value={data.max_discount_amount}
                                onChange={(e) =>
                                    setData('max_discount_amount', e.target.value)
                                }
                                min={0}
                            />
                        </Field>
                        <Field
                            label="محدودیت تعداد استفاده"
                            error={errors.usage_limit}
                        >
                            <Input
                                type="number"
                                value={data.usage_limit}
                                onChange={(e) =>
                                    setData('usage_limit', e.target.value)
                                }
                                min={1}
                            />
                        </Field>
                        <Field label="تاریخ شروع" error={errors.starts_at}>
                            <JalaliDatePicker
                                value={data.starts_at}
                                onChange={(iso) => setData('starts_at', iso)}
                            />
                        </Field>
                        <Field label="تاریخ پایان" error={errors.ends_at}>
                            <JalaliDatePicker
                                value={data.ends_at}
                                onChange={(iso) => setData('ends_at', iso)}
                            />
                        </Field>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label className="text-sm">
                                اعمال روی همه محصولات
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                در صورت غیرفعال بودن، محصولات هدف را انتخاب کنید.
                            </p>
                        </div>
                        <Switch
                            checked={data.applies_to_all}
                            onCheckedChange={(checked) =>
                                setData('applies_to_all', checked)
                            }
                        />
                    </div>

                    {!data.applies_to_all && (
                        <Field label="محصولات هدف" error={errors.product_ids}>
                            <ProductMultiselect
                                options={products}
                                selected={data.product_ids}
                                onChange={(ids) => setData('product_ids', ids)}
                            />
                        </Field>
                    )}

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label className="text-sm">فعال</Label>
                        <Switch
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-1.5"
                        >
                            {processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            ذخیره
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm">
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
