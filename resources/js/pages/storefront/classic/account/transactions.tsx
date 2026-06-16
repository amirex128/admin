import { PaginationNav } from '@/components/pagination-nav';
import { AccountNav } from '@/components/storefront/account-nav';
import { StorefrontLayout } from '@/components/storefront/storefront-layout';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatToman } from '@/lib/format';
import { formatJalaali } from '@/lib/jalali';
import type { Order, Paginated, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    transactions: Paginated<Order>;
};

export default function AccountTransactions({
    store,
    transactions,
}: PageProps) {
    return (
        <StorefrontLayout store={store} title="تراکنش‌ها">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <AccountNav store={store} active="transactions" />

                <div className="space-y-3">
                    <h1 className="text-xl font-bold">تراکنش‌ها</h1>

                    <div className="rounded-xl border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>کد سفارش</TableHead>
                                    <TableHead>تاریخ</TableHead>
                                    <TableHead>مبلغ</TableHead>
                                    <TableHead>وضعیت پرداخت</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-neutral-500"
                                        >
                                            تراکنشی ثبت نشده است.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {transactions.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell dir="ltr">
                                            {order.code}
                                        </TableCell>
                                        <TableCell className="text-neutral-500">
                                            {formatJalaali(order.created_at)}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            {formatToman(order.total)} تومان
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.payment_status ===
                                                    'paid'
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

                    <div className="flex justify-center">
                        <PaginationNav links={transactions.links} />
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
