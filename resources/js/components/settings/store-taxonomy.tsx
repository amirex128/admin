import { router } from '@inertiajs/react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import CategoryController from '@/actions/App/Http/Controllers/User/CategoryController';
import PackagingTypeController from '@/actions/App/Http/Controllers/User/PackagingTypeController';
import { useConfirm } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Category, PackagingType } from '@/types';

/**
 * Inline management of the store's categories and packaging types directly from
 * the store settings page (create, rename/edit, delete). Rendered inside the
 * store settings form, so all actions use plain buttons + the Inertia router.
 */
export function CategoryManager({ categories }: { categories: Category[] }) {
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const confirm = useConfirm();

    function add() {
        if (name.trim() === '') {
            return;
        }

        router.post(
            CategoryController.store().url,
            { name },
            {
                preserveScroll: true,
                onSuccess: () => setName(''),
            },
        );
    }

    function save(category: Category) {
        router.put(
            CategoryController.update(category.id).url,
            { name: editingName, parent_id: category.parent_id },
            {
                preserveScroll: true,
                onSuccess: () => setEditingId(null),
            },
        );
    }

    async function destroy(category: Category) {
        if (
            !(await confirm({
                title: 'حذف دسته‌بندی',
                description: `آیا از حذف دسته‌بندی «${category.name}» مطمئن هستید؟`,
                confirmText: 'حذف',
            }))
        ) {
            return;
        }

        router.delete(CategoryController.destroy(category.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>دسته‌بندی‌ها</CardTitle>
                <CardDescription>
                    دسته‌بندی‌های فروشگاه را ایجاد، ویرایش یا حذف کنید.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                add();
                            }
                        }}
                        placeholder="نام دسته‌بندی جدید"
                    />
                    <Button type="button" onClick={add} className="gap-1.5">
                        <Plus className="size-4" />
                        افزودن
                    </Button>
                </div>

                <ul className="divide-y rounded-lg border">
                    {categories.length === 0 && (
                        <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                            دسته‌بندی‌ای ثبت نشده است.
                        </li>
                    )}
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="flex items-center gap-2 px-3 py-2"
                        >
                            {editingId === category.id ? (
                                <>
                                    <Input
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                save(category);
                                            }
                                        }}
                                        className="h-8"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => save(category)}
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingId(null)}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 text-sm">
                                        {category.name}
                                        {category.parent_name && (
                                            <span className="text-muted-foreground">
                                                {' '}
                                                ← {category.parent_name}
                                            </span>
                                        )}
                                    </span>
                                    {typeof category.products_count ===
                                        'number' && (
                                        <Badge variant="outline">
                                            {category.products_count} محصول
                                        </Badge>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingId(category.id);
                                            setEditingName(category.name);
                                        }}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => destroy(category)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

export function PackagingManager({
    packagingTypes,
}: {
    packagingTypes: PackagingType[];
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const confirm = useConfirm();

    function add() {
        if (name.trim() === '') {
            return;
        }

        router.post(
            PackagingTypeController.store().url,
            { name, description },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setName('');
                    setDescription('');
                },
            },
        );
    }

    function save(packaging: PackagingType) {
        router.put(
            PackagingTypeController.update(packaging.id).url,
            { name: editingName, description: packaging.description },
            {
                preserveScroll: true,
                onSuccess: () => setEditingId(null),
            },
        );
    }

    async function destroy(packaging: PackagingType) {
        if (
            !(await confirm({
                title: 'حذف بسته‌بندی',
                description: `آیا از حذف بسته‌بندی «${packaging.name}» مطمئن هستید؟`,
                confirmText: 'حذف',
            }))
        ) {
            return;
        }

        router.delete(PackagingTypeController.destroy(packaging.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>بسته‌بندی‌ها</CardTitle>
                <CardDescription>
                    انواع بسته‌بندی اختصاصی فروشگاه را مدیریت کنید.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                add();
                            }
                        }}
                        placeholder="نام بسته‌بندی"
                    />
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="توضیح (اختیاری)"
                    />
                    <Button type="button" onClick={add} className="gap-1.5">
                        <Plus className="size-4" />
                        افزودن
                    </Button>
                </div>

                <ul className="divide-y rounded-lg border">
                    {packagingTypes.length === 0 && (
                        <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                            بسته‌بندی‌ای ثبت نشده است.
                        </li>
                    )}
                    {packagingTypes.map((packaging) => (
                        <li
                            key={packaging.id}
                            className="flex items-center gap-2 px-3 py-2"
                        >
                            {editingId === packaging.id ? (
                                <>
                                    <Input
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                save(packaging);
                                            }
                                        }}
                                        className="h-8"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => save(packaging)}
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingId(null)}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 text-sm">
                                        {packaging.name}
                                        {packaging.description && (
                                            <span className="text-muted-foreground">
                                                {' '}
                                                — {packaging.description}
                                            </span>
                                        )}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingId(packaging.id);
                                            setEditingName(packaging.name);
                                        }}
                                    >
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => destroy(packaging)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
