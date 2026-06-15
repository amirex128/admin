import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Ticket, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import CouponController from '@/actions/App/Http/Controllers/User/CouponController';
import { CouponFormDialog } from '@/components/coupons/coupon-form-dialog';
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
import { index as couponsIndex } from '@/routes/coupons';
import type { Coupon, DiscountTypeOption, GeoOption, Paginated } from '@/types';

const ALL = '__all__';

type PageProps = {
    coupons: Paginated<Coupon>;
    products: GeoOption[];
    discountTypes: DiscountTypeOption[];
    filters: { search: string; status: string | null };
};

export default function CouponsIndex({
    coupons,
    products,
    discountTypes,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        if (search === (filters.search ?? '')) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                couponsIndex().url,
                { status: filters.status ?? undefined, search },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, filters]);

    function applyStatus(value: string | null) {
        router.get(
            couponsIndex().url,
            { search, status: value ?? undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function toggle(coupon: Coupon) {
        router.patch(
            CouponController.toggle(coupon.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function destroy(coupon: Coupon) {
        if (!confirm(`حذف کد تخفیف «${coupon.code}»؟`)) {
            return;
        }

        router.delete(CouponController.destroy(coupon.id).url, {
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
            <Head title="کدهای تخفیف" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="کدهای تخفیف"
                        description="کمپین‌های تخفیف با بازه زمانی شمسی و هدف‌گذاری محصولات."
                    />
                    <CouponFormDialog
                        discountTypes={discountTypes}
                        products={products}
                        submitUrl={CouponController.store().url}
                        method="post"
                        trigger={
                            <Button className="gap-1.5">
                                <Plus className="size-4" />
                                کد تخفیف جدید
                            </Button>
                        }
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="جستجوی کد تخفیف"
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
                            <SelectItem value="active">فعال</SelectItem>
                            <SelectItem value="inactive">غیرفعال</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>کد</TableHead>
                                <TableHead>تخفیف</TableHead>
                                <TableHead>بازه اعتبار</TableHead>
                                <TableHead>هدف</TableHead>
                                <TableHead>استفاده</TableHead>
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
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        <span className="flex flex-col items-center gap-2">
                                            <Ticket className="size-6" />
                                            کد تخفیفی ثبت نشده است.
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                            {coupons.data.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-medium" dir="ltr">
                                        {coupon.code}
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
                                        {coupon.applies_to_all ? (
                                            <Badge variant="secondary">
                                                همه محصولات
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                {coupon.products_count ?? 0}{' '}
                                                محصول
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {coupon.used_count}
                                        {coupon.usage_limit
                                            ? ` / ${coupon.usage_limit}`
                                            : ''}
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
                                        <div className="flex justify-end gap-1">
                                            <CouponFormDialog
                                                discountTypes={discountTypes}
                                                products={products}
                                                coupon={coupon}
                                                submitUrl={
                                                    CouponController.update(
                                                        coupon.id,
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

CouponsIndex.layout = {
    breadcrumbs: [
        {
            title: 'کدهای تخفیف',
            href: couponsIndex(),
        },
    ],
};
