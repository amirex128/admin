import { Head, router } from '@inertiajs/react';
import {
    BadgeCheck,
    ImageOff,
    Search,
    Trash2,
    User as UserIcon,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { RejectProductDialog } from '@/components/products/reject-product-dialog';
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
import { index as adminProductsIndex } from '@/routes/admin/products';
import type { Paginated, Product, SelectOption } from '@/types';

const ALL = '__all__';

type PageProps = {
    products: Paginated<Product>;
    approvalStatuses: SelectOption[];
    filters: { search: string; user: string; approval: string | null };
};

export default function AdminProductsIndex({
    products,
    approvalStatuses,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [user, setUser] = useState(filters.user ?? '');

    useEffect(() => {
        if (
            search === (filters.search ?? '') &&
            user === (filters.user ?? '')
        ) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                adminProductsIndex().url,
                { search, user, approval: filters.approval ?? undefined },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, user, filters]);

    function applyApproval(value: string | null) {
        router.get(
            adminProductsIndex().url,
            { search, user, approval: value ?? undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function approve(product: Product) {
        router.patch(
            ProductController.approve(product.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function toggle(product: Product) {
        router.patch(
            ProductController.toggle(product.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function destroy(product: Product) {
        if (!confirm(`حذف محصول «${product.name}»؟`)) {
            return;
        }

        router.delete(ProductController.destroy(product.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="مدیریت محصولات" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="محصولات کاربران"
                    description="همه محصولات سامانه را مشاهده و مدیریت کنید."
                />

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-xs flex-1">
                        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="جستجوی نام یا شناسه محصول"
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
                    <Select
                        value={filters.approval ?? ALL}
                        onValueChange={(value) =>
                            applyApproval(value === ALL ? null : value)
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="وضعیت ممیزی" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>همه وضعیت‌ها</SelectItem>
                            {approvalStatuses.map((status) => (
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
                                <TableHead className="w-14">تصویر</TableHead>
                                <TableHead>نام</TableHead>
                                <TableHead>مالک</TableHead>
                                <TableHead>قیمت</TableHead>
                                <TableHead>ممیزی</TableHead>
                                <TableHead>فعال</TableHead>
                                <TableHead className="text-left">
                                    عملیات
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        محصولی یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}
                            {products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {product.images[0] ? (
                                            <img
                                                src={product.images[0].url}
                                                alt=""
                                                className="size-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                <ImageOff className="size-4" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <span className="flex items-center gap-2">
                                            {product.name}
                                            {product.is_special_offer && (
                                                <Badge variant="secondary">
                                                    ویژه
                                                </Badge>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {product.owner
                                            ? `${product.owner.name} (#${product.owner.id})`
                                            : '—'}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {formatToman(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                product.approval_status ===
                                                'approved'
                                                    ? 'secondary'
                                                    : product.approval_status ===
                                                        'rejected'
                                                      ? 'destructive'
                                                      : 'outline'
                                            }
                                            title={
                                                product.rejection_reason ??
                                                undefined
                                            }
                                        >
                                            {product.approval_status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={product.is_active}
                                            onCheckedChange={() =>
                                                toggle(product)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            {product.approval_status !==
                                                'approved' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        approve(product)
                                                    }
                                                    className="text-emerald-600 hover:text-emerald-600"
                                                    title="تأیید"
                                                >
                                                    <BadgeCheck className="size-4" />
                                                </Button>
                                            )}
                                            {product.approval_status !==
                                                'rejected' && (
                                                <RejectProductDialog
                                                    product={product}
                                                    submitUrl={
                                                        ProductController.reject(
                                                            product.id,
                                                        ).url
                                                    }
                                                    trigger={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-amber-600 hover:text-amber-600"
                                                            title="رد"
                                                        >
                                                            <X className="size-4" />
                                                        </Button>
                                                    }
                                                />
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => destroy(product)}
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
                        {formatToman(products.total)} محصول
                    </p>
                    <PaginationNav links={products.links} />
                </div>
            </div>
        </>
    );
}

AdminProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'محصولات کاربران',
            href: adminProductsIndex(),
        },
    ],
};
