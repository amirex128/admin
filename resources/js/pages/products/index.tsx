import { Head, Link, router } from '@inertiajs/react';
import {
    Copy,
    FileSpreadsheet,
    ImageOff,
    Pencil,
    Plus,
    Search,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import ProductController from '@/actions/App/Http/Controllers/User/ProductController';
import Heading from '@/components/heading';
import { PaginationNav } from '@/components/pagination-nav';
import { ExcelImportDialog } from '@/components/products/excel-import-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { create as productsCreate, index as productsIndex } from '@/routes/products';
import type { Category, Paginated, Product } from '@/types';

const ALL = '__all__';

type PageProps = {
    products: Paginated<Product>;
    categories: Category[];
    filters: {
        search: string;
        category_id: number | null;
        status: string | null;
    };
};

export default function ProductsIndex({
    products,
    categories,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const rejected = products.data.filter(
        (product) => product.approval_status === 'rejected',
    );

    useEffect(() => {
        if (search === (filters.search ?? '')) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                productsIndex().url,
                { ...cleanFilters(filters), search },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, filters]);

    function applyFilter(key: 'category_id' | 'status', value: string | null) {
        router.get(
            productsIndex().url,
            { ...cleanFilters(filters), search, [key]: value ?? undefined },
            { preserveState: true, preserveScroll: true, replace: true },
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

    function duplicate(product: Product) {
        router.post(
            ProductController.duplicate(product.id).url,
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

    return (
        <>
            <Head title="مدیریت محصولات" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="محصولات"
                        description="محصولات خود را ایجاد، ویرایش، کپی یا ایمپورت کنید."
                    />
                    <div className="flex gap-2">
                        <ExcelImportDialog
                            trigger={
                                <Button variant="outline" className="gap-1.5">
                                    <FileSpreadsheet className="size-4" />
                                    ایمپورت اکسل
                                </Button>
                            }
                        />
                        <Button asChild className="gap-1.5">
                            <Link href={productsCreate()}>
                                <Plus className="size-4" />
                                محصول جدید
                            </Link>
                        </Button>
                    </div>
                </div>

                {rejected.length > 0 && (
                    <Alert variant="destructive">
                        <TriangleAlert />
                        <AlertTitle>
                            {rejected.length} محصول توسط مدیر رد شده است
                        </AlertTitle>
                        <AlertDescription>
                            {rejected.map((product) => (
                                <p key={product.id}>
                                    «{product.name}»:{' '}
                                    {product.rejection_reason ??
                                        'بدون ذکر دلیل'}
                                </p>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="جستجو بر اساس نام یا شناسه"
                            className="pr-9"
                        />
                    </div>
                    <Select
                        value={
                            filters.category_id
                                ? String(filters.category_id)
                                : ALL
                        }
                        onValueChange={(value) =>
                            applyFilter('category_id', value === ALL ? null : value)
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="دسته‌بندی" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>همه دسته‌بندی‌ها</SelectItem>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.status ?? ALL}
                        onValueChange={(value) =>
                            applyFilter('status', value === ALL ? null : value)
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
                                <TableHead className="w-14">تصویر</TableHead>
                                <TableHead>نام</TableHead>
                                <TableHead>شناسه</TableHead>
                                <TableHead>قیمت</TableHead>
                                <TableHead>موجودی</TableHead>
                                <TableHead>تنوع</TableHead>
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
                                        colSpan={9}
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
                                        {product.sku ?? '—'}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {formatToman(product.price)}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {product.stock}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {product.variations_count ?? 0}
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
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={
                                                        ProductController.edit(
                                                            product.id,
                                                        ).url
                                                    }
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    duplicate(product)
                                                }
                                                title="کپی"
                                            >
                                                <Copy className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => destroy(product)}
                                                className="text-destructive hover:text-destructive"
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

function cleanFilters(filters: PageProps['filters']) {
    return {
        category_id: filters.category_id ?? undefined,
        status: filters.status ?? undefined,
    };
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'محصولات',
            href: productsIndex(),
        },
    ],
};
