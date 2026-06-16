import { Head, router } from '@inertiajs/react';
import { Search, Trash2, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import AdminCouponController from '@/actions/App/Http/Controllers/Admin/CouponController';
import { useConfirm } from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { index as adminCouponsIndex } from '@/routes/admin/coupons';
import type { Coupon, Paginated } from '@/types';

type PageProps = {
    coupons: Paginated<Coupon>;
    filters: { search: string; user: string };
};

export default function AdminCouponsIndex({ coupons, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [user, setUser] = useState(filters.user ?? '');
    const confirm = useConfirm();

    useEffect(() => {
        if (
            search === (filters.search ?? '') &&
            user === (filters.user ?? '')
        ) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                adminCouponsIndex().url,
                { search, user },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, user, filters]);

    function toggle(coupon: Coupon) {
        router.patch(
            AdminCouponController.toggle(coupon.id).url,
            {},
            { preserveScroll: true },
        );
    }

    async function destroy(coupon: Coupon) {
        if (
            !(await confirm({
                title: 'حذف کد تخفیف',
                description: `آیا از حذف کد تخفیف «${coupon.code}» مطمئن هستید؟`,
                confirmText: 'حذف',
            }))
        ) {
            return;
        }

        router.delete(AdminCouponController.destroy(coupon.id).url, {
            preserveScroll: true,
        });
    }

    function validity(coupon: Coupon) {
        const from = formatJalaali(coupon.starts_at);
        const to = formatJalaali(coupon.ends_at);

        if (!from && !to) {
            return 'بدون محدودیت';
        }

        return `${from || '...'} تا ${to || '...'}`;
    }

    return (
        <>
            <Head title="کدهای تخفیف کاربران" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="کدهای تخفیف کاربران"
                    description="همه کدهای تخفیف سامانه را مشاهده و مدیریت کنید."
                />

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-xs flex-1">
                        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="جستجوی کد تخفیف"
                            className="pr-9"
                        />
                    </div>
                    <div className="relative max-w-xs flex-1">
                        <UserIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={user}
                            onChange={(event) => setUser(event.target.value)}
                            placeholder="فیلتر بر اساس نام یا شناسه کاربر"
                            className="pr-9"
                        />
                    </div>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>کد</TableHead>
                                <TableHead>مالک</TableHead>
                                <TableHead>تخفیف</TableHead>
                                <TableHead>بازه اعتبار</TableHead>
                                <TableHead>فعال</TableHead>
                                <TableHead className="text-left">
                                    عملیات
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        کد تخفیفی یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}
                            {coupons.data.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-medium" dir="ltr">
                                        {coupon.code}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {coupon.owner
                                            ? `${coupon.owner.name} (#${coupon.owner.id})`
                                            : '—'}
                                    </TableCell>
                                    <TableCell>
                                        {coupon.type === 'percentage'
                                            ? `${coupon.value}٪`
                                            : `${formatToman(coupon.value)} تومان`}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {validity(coupon)}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={coupon.is_active}
                                            onCheckedChange={() =>
                                                toggle(coupon)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => destroy(coupon)}
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
                        {coupons.total} کد تخفیف
                    </p>
                    <PaginationNav links={coupons.links} />
                </div>
            </div>
        </>
    );
}

AdminCouponsIndex.layout = {
    breadcrumbs: [
        {
            title: 'کدهای تخفیف کاربران',
            href: adminCouponsIndex(),
        },
    ],
};
