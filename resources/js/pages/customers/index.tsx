import { Head, router } from '@inertiajs/react';
import {
    FileSpreadsheet,
    Pencil,
    Plus,
    Search,
    ShieldBan,
    ShieldCheck,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import CustomerController from '@/actions/App/Http/Controllers/User/CustomerController';
import { CustomerFormDialog } from '@/components/customers/customer-form-dialog';
import { CustomerImportDialog } from '@/components/customers/customer-import-dialog';
import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { formatToman } from '@/lib/format';
import { index as customersIndex } from '@/routes/customers';
import type { Customer, CustomerStatusOption, Paginated } from '@/types';

const ALL = '__all__';

type PageProps = {
    customers: Paginated<Customer>;
    statuses: CustomerStatusOption[];
    filters: {
        search: string;
        status: string | null;
    };
};

export default function CustomersIndex({
    customers,
    statuses,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        if (search === (filters.search ?? '')) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                customersIndex().url,
                { status: filters.status ?? undefined, search },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, filters]);

    function applyStatus(value: string | null) {
        router.get(
            customersIndex().url,
            { search, status: value ?? undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function toggleBlock(customer: Customer) {
        router.patch(
            CustomerController.toggleBlock(customer.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function destroy(customer: Customer) {
        if (!confirm(`حذف مشتری «${customer.name}»؟`)) {
            return;
        }

        router.delete(CustomerController.destroy(customer.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="مدیریت مشتریان" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="مشتریان"
                        description="باشگاه مشتریان فروشگاه شما؛ ایجاد، ویرایش، مسدودسازی و ایمپورت اکسل."
                    />
                    <div className="flex gap-2">
                        <CustomerImportDialog
                            trigger={
                                <Button variant="outline" className="gap-1.5">
                                    <FileSpreadsheet className="size-4" />
                                    ایمپورت اکسل
                                </Button>
                            }
                        />
                        <CustomerFormDialog
                            statuses={statuses}
                            submitUrl={CustomerController.store().url}
                            method="post"
                            trigger={
                                <Button className="gap-1.5">
                                    <Plus className="size-4" />
                                    مشتری جدید
                                </Button>
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="جستجو بر اساس نام، موبایل، ایمیل یا کد ملی"
                            className="pr-9"
                        />
                    </div>
                    <Select
                        value={filters.status ?? ALL}
                        onValueChange={(value) =>
                            applyStatus(value === ALL ? null : value)
                        }
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="وضعیت" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>همه</SelectItem>
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
                                <TableHead>نام</TableHead>
                                <TableHead>موبایل</TableHead>
                                <TableHead>شهر</TableHead>
                                <TableHead>سفارش‌ها</TableHead>
                                <TableHead>مجموع خرید</TableHead>
                                <TableHead>وضعیت</TableHead>
                                <TableHead className="text-left">
                                    عملیات
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        مشتری‌ای یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}
                            {customers.data.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        {customer.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground tabular-nums">
                                        {customer.phone ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {customer.city ?? '—'}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {customer.orders_count ?? 0}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {formatToman(customer.orders_total ?? 0)}
                                    </TableCell>
                                    <TableCell>
                                        <CustomerStatusBadge
                                            customer={customer}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <CustomerFormDialog
                                                statuses={statuses}
                                                customer={customer}
                                                submitUrl={
                                                    CustomerController.update(
                                                        customer.id,
                                                    ).url
                                                }
                                                method="put"
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="ویرایش"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    toggleBlock(customer)
                                                }
                                                title={
                                                    customer.status ===
                                                    'blocked'
                                                        ? 'رفع مسدودی'
                                                        : 'مسدودسازی'
                                                }
                                            >
                                                {customer.status ===
                                                'blocked' ? (
                                                    <ShieldCheck className="size-4" />
                                                ) : (
                                                    <ShieldBan className="size-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => destroy(customer)}
                                                className="text-destructive hover:text-destructive"
                                                title="حذف"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {formatToman(customers.total)} مشتری
                    </p>
                    <PaginationNav links={customers.links} />
                </div>
            </div>
        </>
    );
}

export function CustomerStatusBadge({ customer }: { customer: Customer }) {
    return (
        <Badge
            variant={customer.status === 'blocked' ? 'destructive' : 'secondary'}
        >
            {customer.status_label}
        </Badge>
    );
}

CustomersIndex.layout = {
    breadcrumbs: [
        {
            title: 'مشتریان',
            href: customersIndex(),
        },
    ],
};
