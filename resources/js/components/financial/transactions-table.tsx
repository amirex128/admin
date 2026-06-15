import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDateTime, formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { WalletTransaction } from '@/types';

/**
 * A shared, RTL-aware ledger table for wallet transactions.
 */
export function TransactionsTable({
    transactions,
    showPerformer = false,
}: {
    transactions: WalletTransaction[];
    showPerformer?: boolean;
}) {
    if (transactions.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                هنوز تراکنشی ثبت نشده است.
            </div>
        );
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>نوع</TableHead>
                        <TableHead>بابت</TableHead>
                        <TableHead>مبلغ (تومان)</TableHead>
                        <TableHead>موجودی پس از تراکنش</TableHead>
                        {showPerformer && <TableHead>توسط</TableHead>}
                        <TableHead>تاریخ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => {
                        const isCredit = transaction.type === 'credit';

                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'gap-1',
                                            isCredit
                                                ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                                : 'border-rose-500/40 text-rose-600 dark:text-rose-400',
                                        )}
                                    >
                                        {isCredit ? (
                                            <ArrowDownLeft className="size-3" />
                                        ) : (
                                            <ArrowUpRight className="size-3" />
                                        )}
                                        {transaction.type_label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">
                                        {transaction.reason_label}
                                    </span>
                                    {transaction.description && (
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.description}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        'font-semibold tabular-nums',
                                        isCredit
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-rose-600 dark:text-rose-400',
                                    )}
                                >
                                    {isCredit ? '+' : '−'}
                                    {formatToman(transaction.amount)}
                                </TableCell>
                                <TableCell className="text-muted-foreground tabular-nums">
                                    {formatToman(transaction.balance_after)}
                                </TableCell>
                                {showPerformer && (
                                    <TableCell className="text-muted-foreground">
                                        {transaction.performed_by ?? '—'}
                                    </TableCell>
                                )}
                                <TableCell className="text-muted-foreground">
                                    {formatDateTime(transaction.created_at)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
