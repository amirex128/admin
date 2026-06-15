import { Head, router } from '@inertiajs/react';
import { ChevronLeft, Search, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatToman } from '@/lib/format';
import {
    index as adminUsersIndex,
    show as adminUserShow,
} from '@/routes/admin/users';
import type { AdminUserRow, Paginated } from '@/types';

type PageProps = {
    users: Paginated<AdminUserRow>;
    filters: { search: string };
};

export default function AdminUsersIndex({ users, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        // Debounce the search so we don't request on every keystroke.
        if (search === (filters.search ?? '')) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                adminUsersIndex().url,
                { search },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, filters.search]);

    return (
        <>
            <Head title="مدیریت کاربران" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="کاربران"
                    description="لیست همه کاربران سامانه. برای مدیریت هر کاربر روی ردیف آن کلیک کنید."
                />

                <div className="relative max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="جستجو بر اساس نام، موبایل یا ایمیل"
                        className="pr-9"
                    />
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>شناسه</TableHead>
                                <TableHead>نام</TableHead>
                                <TableHead>موبایل</TableHead>
                                <TableHead>ایمیل</TableHead>
                                <TableHead>موجودی (تومان)</TableHead>
                                <TableHead>اشتراک‌ها</TableHead>
                                <TableHead>تاریخ عضویت</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        کاربری یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}

                            {users.data.map((user) => (
                                <TableRow
                                    key={user.id}
                                    onClick={() =>
                                        router.visit(adminUserShow(user.id).url)
                                    }
                                    className="cursor-pointer"
                                >
                                    <TableCell className="text-muted-foreground">
                                        {user.id}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <span className="flex items-center gap-2">
                                            {user.name}
                                            {user.is_admin && (
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1"
                                                >
                                                    <ShieldCheck className="size-3" />
                                                    مدیر
                                                </Badge>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell dir="ltr" className="text-start">
                                        {user.phone}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.email ?? '—'}
                                    </TableCell>
                                    <TableCell className="font-semibold tabular-nums">
                                        {formatToman(user.balance)}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {user.subscriptions_count}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(user.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <ChevronLeft className="size-4 text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {formatToman(users.total)} کاربر
                    </p>
                    <PaginationNav links={users.links} />
                </div>
            </div>
        </>
    );
}

AdminUsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'مدیریت کاربران',
            href: adminUsersIndex(),
        },
    ],
};
