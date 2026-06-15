import { router, useForm } from '@inertiajs/react';
import { Download } from 'lucide-react';

import InputError from '@/components/input-error';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { OrderStatusStepper } from '@/components/orders/order-status-stepper';
import { Badge } from '@/components/ui/badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime, formatToman } from '@/lib/format';
import type { Order, OrderStatusOption, SelectOption } from '@/types';

/**
 * Full order detail with the status wizard, line items, history timeline and
 * inline actions (status transition, payment toggle, PDF download). Shared by
 * the seller and admin order pages.
 */
export function OrderDetail({
    order,
    statusOptions,
    paymentStatusOptions,
    statusUrl,
    paymentUrl,
    pdfUrl,
}: {
    order: Order;
    statusOptions: OrderStatusOption[];
    paymentStatusOptions: SelectOption[];
    statusUrl: string;
    paymentUrl: string;
    pdfUrl: string;
}) {
    const statusForm = useForm<{
        status: string;
        tracking_code: string;
        note: string;
    }>({
        status: order.status,
        tracking_code: order.tracking_code ?? '',
        note: '',
    });

    function submitStatus(event: React.FormEvent) {
        event.preventDefault();
        statusForm.patch(statusUrl, { preserveScroll: true });
    }

    function togglePayment(value: string) {
        router.patch(
            paymentUrl,
            { payment_status: value },
            { preserveScroll: true },
        );
    }

    const requiresTracking = statusForm.data.status === 'shipping';

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <span dir="ltr">{order.code}</span>
                                <OrderStatusBadge
                                    label={order.status_label}
                                    color={order.status_color}
                                />
                                <Badge
                                    variant={
                                        order.payment_status === 'paid'
                                            ? 'secondary'
                                            : 'outline'
                                    }
                                >
                                    {order.payment_status_label}
                                </Badge>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {formatDateTime(order.created_at)}
                            </p>
                        </div>
                        <Button asChild variant="outline" className="gap-1.5">
                            <a href={pdfUrl} target="_blank" rel="noreferrer">
                                <Download className="size-4" />
                                دانلود{' '}
                                {order.status === 'proforma'
                                    ? 'پیش‌فاکتور'
                                    : 'فاکتور'}
                            </a>
                        </Button>
                    </CardHeader>
                    <CardContent className="overflow-x-auto pt-2">
                        <OrderStatusStepper
                            statuses={statusOptions}
                            current={order.status}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>اقلام سفارش</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>کالا</TableHead>
                                        <TableHead>قیمت واحد</TableHead>
                                        <TableHead>تعداد</TableHead>
                                        <TableHead>تخفیف</TableHead>
                                        <TableHead>جمع</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(order.items ?? []).map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                                {formatToman(item.unit_price)}
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                                {item.discount_percent}٪
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                                {formatToman(item.total)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <dl className="mt-4 space-y-1.5 text-sm">
                            <SummaryRow
                                label="جمع اقلام"
                                value={order.subtotal}
                            />
                            <SummaryRow
                                label={`مالیات (${order.tax_percent}٪)`}
                                value={order.tax_amount}
                            />
                            <SummaryRow
                                label="هزینه ارسال"
                                value={order.shipping_cost}
                            />
                            <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                                <dt>مبلغ کل</dt>
                                <dd className="tabular-nums">
                                    {formatToman(order.total)} تومان
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>تاریخچه وضعیت</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="relative space-y-4 border-r pr-4">
                            {(order.histories ?? []).map((history) => (
                                <li key={history.id} className="relative">
                                    <span className="absolute top-1.5 -right-[1.32rem] size-2.5 rounded-full bg-primary" />
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {history.status_label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDateTime(history.created_at)}
                                        </span>
                                    </div>
                                    {history.note && (
                                        <p className="text-sm text-muted-foreground">
                                            {history.note}
                                        </p>
                                    )}
                                </li>
                            ))}
                            {(order.histories ?? []).length === 0 && (
                                <li className="text-sm text-muted-foreground">
                                    تاریخچه‌ای ثبت نشده است.
                                </li>
                            )}
                        </ol>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>تغییر وضعیت</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitStatus} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>وضعیت جدید</Label>
                                <Select
                                    value={statusForm.data.status}
                                    onValueChange={(value) =>
                                        statusForm.setData('status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={statusForm.errors.status}
                                />
                            </div>

                            {requiresTracking && (
                                <div className="grid gap-2">
                                    <Label>کد رهگیری پستی</Label>
                                    <Input
                                        value={statusForm.data.tracking_code}
                                        onChange={(event) =>
                                            statusForm.setData(
                                                'tracking_code',
                                                event.target.value,
                                            )
                                        }
                                        dir="ltr"
                                    />
                                    <InputError
                                        message={
                                            statusForm.errors.tracking_code
                                        }
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label>یادداشت (اختیاری)</Label>
                                <Textarea
                                    value={statusForm.data.note}
                                    onChange={(event) =>
                                        statusForm.setData(
                                            'note',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={statusForm.processing}
                            >
                                ثبت وضعیت
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>وضعیت پرداخت</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={order.payment_status}
                            onValueChange={togglePayment}
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>مشخصات سفارش‌دهنده</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {order.owner && (
                            <InfoRow label="فروشنده" value={order.owner.name} />
                        )}
                        <InfoRow label="نام" value={order.customer_name} />
                        <InfoRow
                            label="تلفن"
                            value={order.customer_phone ?? '—'}
                        />
                        <InfoRow
                            label="استان / شهر"
                            value={
                                [order.province, order.city]
                                    .filter(Boolean)
                                    .join(' / ') || '—'
                            }
                        />
                        <InfoRow label="آدرس" value={order.address ?? '—'} />
                        <InfoRow
                            label="روش ارسال"
                            value={order.shipping_method_label ?? '—'}
                        />
                        <InfoRow
                            label="روش پرداخت"
                            value={order.payment_method_label ?? '—'}
                        />
                        <InfoRow
                            label="کد رهگیری"
                            value={order.tracking_code ?? '—'}
                        />
                    </CardContent>
                </Card>
            </div>
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

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-end font-medium">{value}</span>
        </div>
    );
}
