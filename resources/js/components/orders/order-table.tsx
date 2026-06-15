import { router } from '@inertiajs/react';

import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatToman } from '@/lib/format';
import type { Order } from '@/types';

/**
 * The orders data table used by both the seller and admin lists.
 */
export function OrderTable({
    orders,
    showOrderUrl,
    showOwner = false,
}: {
    orders: Order[];
    showOrderUrl: (id: number) => string;
    showOwner?: boolean;
}) {
    const columns = showOwner ? 8 : 7;

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>کد سفارش</TableHead>
                        <TableHead>تاریخ</TableHead>
                        <TableHead>سفارش‌دهنده</TableHead>
                        {showOwner && <TableHead>فروشنده</TableHead>}
                        <TableHead>استان / شهر</TableHead>
                        <TableHead>قیمت پرداختی</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead>پرداخت</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns}
                                className="h-24 text-center text-muted-foreground"
                            >
                                سفارشی یافت نشد.
                            </TableCell>
                        </TableRow>
                    )}
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            onClick={() => router.visit(showOrderUrl(order.id))}
                            className="cursor-pointer"
                        >
                            <TableCell className="font-medium" dir="ltr">
                                <span className="block text-start">
                                    {order.code}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatDate(order.created_at)}
                            </TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            {showOwner && (
                                <TableCell className="text-muted-foreground">
                                    {order.owner?.name ?? '—'}
                                </TableCell>
                            )}
                            <TableCell className="text-muted-foreground">
                                {[order.province, order.city]
                                    .filter(Boolean)
                                    .join(' / ') || '—'}
                            </TableCell>
                            <TableCell className="tabular-nums">
                                {formatToman(order.total)} تومان
                            </TableCell>
                            <TableCell>
                                <OrderStatusBadge
                                    label={order.status_label}
                                    color={order.status_color}
                                />
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        order.payment_status === 'paid'
                                            ? 'secondary'
                                            : 'outline'
                                    }
                                >
                                    {order.payment_status_label}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
