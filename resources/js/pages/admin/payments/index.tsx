import { Head, router } from '@inertiajs/react';
import {
    RotateCcw,
    Search,
    Undo2,
    User as UserIcon,
    Info,
    ListChecks,
    Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import PaymentController from '@/actions/App/Http/Controllers/Admin/PaymentController';
import { useConfirm } from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { formatDateTime, formatToman } from '@/lib/format';
import { HttpError, postJson } from '@/lib/http';
import { index as adminPaymentsIndex } from '@/routes/admin/payments';
import type { Paginated, Payment, SelectOption } from '@/types';

const ALL = '__all__';

type UnverifiedRow = {
    authority: string;
    amount: number;
    callback_url: string;
    date: string;
};

type PageProps = {
    payments: Paginated<Payment>;
    statuses: SelectOption[];
    filters: { search: string; user: string; status: string | null };
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    pending: 'secondary',
    failed: 'destructive',
    reversed: 'outline',
    refunded: 'outline',
};

export default function AdminPaymentsIndex({
    payments,
    statuses,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [user, setUser] = useState(filters.user ?? '');
    const confirm = useConfirm();

    useEffect(() => {
        if (search === (filters.search ?? '') && user === (filters.user ?? '')) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                adminPaymentsIndex().url,
                { search, user, status: filters.status ?? undefined },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, user, filters]);

    function applyStatus(status: string | null) {
        router.get(
            adminPaymentsIndex().url,
            { search, user, status: status ?? undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    async function reverse(payment: Payment) {
        if (
            !(await confirm({
                title: 'برگشت وجه (ریورس)',
                description: 'برگشت وجه (ریورس) این تراکنش انجام شود؟',
                confirmText: 'برگشت وجه',
            }))
        ) {
            return;
        }

        router.post(
            PaymentController.reverse(payment.id).url,
            {},
            { preserveScroll: true },
        );
    }

    async function refund(payment: Payment) {
        if (
            !(await confirm({
                title: 'استرداد وجه',
                description: 'استرداد وجه این تراکنش انجام شود؟',
                confirmText: 'استرداد',
            }))
        ) {
            return;
        }

        router.post(
            PaymentController.refund(payment.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function inquiry(payment: Payment) {
        router.post(
            PaymentController.inquiry(payment.id).url,
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="مدیریت تراکنش‌ها" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="تراکنش‌های پرداخت"
                        description="پرداخت‌های شارژ کیف پول را مدیریت، ریورس یا مسترد کنید."
                    />
                    <UnverifiedDialog />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-xs flex-1">
                        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="کد پیگیری یا Authority"
                            className="pr-9"
                        />
                    </div>
                    <div className="relative max-w-xs flex-1">
                        <UserIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={user}
                            onChange={(event) => setUser(event.target.value)}
                            placeholder="نام یا شناسه کاربر"
                            className="pr-9"
                        />
                    </div>
                    <Select
                        value={filters.status ?? ALL}
                        onValueChange={(value) =>
                            applyStatus(value === ALL ? null : value)
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="وضعیت" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>همه وضعیت‌ها</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem
                                    key={status.value}
                                    value={status.value}
                                >
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>کاربر</TableHead>
                                <TableHead>مبلغ</TableHead>
                                <TableHead>کد پیگیری</TableHead>
                                <TableHead>وضعیت</TableHead>
                                <TableHead>تاریخ پرداخت</TableHead>
                                <TableHead className="text-left">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        تراکنشی یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}
                            {payments.data.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">
                                        {payment.user
                                            ? `${payment.user.name} (#${payment.user.id})`
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {formatToman(payment.amount)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground tabular-nums">
                                        {payment.ref_id ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                STATUS_VARIANT[payment.status] ??
                                                'secondary'
                                            }
                                        >
                                            {payment.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {payment.paid_at
                                            ? formatDateTime(payment.paid_at)
                                            : '—'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="استعلام"
                                                onClick={() => inquiry(payment)}
                                            >
                                                <Info className="size-4" />
                                            </Button>
                                            {payment.is_reversible && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="ریورس"
                                                    onClick={() =>
                                                        reverse(payment)
                                                    }
                                                >
                                                    <Undo2 className="size-4" />
                                                </Button>
                                            )}
                                            {payment.is_refundable && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="استرداد"
                                                    onClick={() =>
                                                        refund(payment)
                                                    }
                                                >
                                                    <RotateCcw className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {formatToman(payments.total)} تراکنش
                    </p>
                    <PaginationNav links={payments.links} />
                </div>
            </div>
        </>
    );
}

function UnverifiedDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<UnverifiedRow[]>([]);

    async function load() {
        setLoading(true);

        try {
            const result = await postJson<{ authorities: UnverifiedRow[] }>(
                PaymentController.unverified().url,
                {},
            );
            setRows(result.authorities);
        } catch (error) {
            const message =
                error instanceof HttpError
                    ? error.message
                    : 'خطا در دریافت اطلاعات.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (next) {
                    void load();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                    <ListChecks className="size-4" />
                    تراکنش‌های تأیید نشده
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>تراکنش‌های تأیید نشده</DialogTitle>
                    <DialogDescription>
                        تراکنش‌هایی که در درگاه پرداخت شده‌اند اما هنوز تأیید
                        نشده‌اند.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : rows.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        تراکنش تأیید نشده‌ای وجود ندارد.
                    </p>
                ) : (
                    <div className="max-h-96 overflow-y-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Authority</TableHead>
                                    <TableHead>مبلغ</TableHead>
                                    <TableHead>تاریخ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.authority}>
                                        <TableCell className="font-mono text-xs">
                                            {row.authority}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            {formatToman(row.amount)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {row.date}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

AdminPaymentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'تراکنش‌های پرداخت',
            href: adminPaymentsIndex(),
        },
    ],
};
