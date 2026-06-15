import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import CategoryController from '@/actions/App/Http/Controllers/User/CategoryController';
import InputError from '@/components/input-error';
import { Combobox } from '@/components/products/combobox';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

/**
 * A searchable category picker that can create new (root or nested)
 * categories inline through a dialog.
 */
export function CategorySelect({
    categories,
    value,
    onChange,
}: {
    categories: Category[];
    value: number | null;
    onChange: (value: number | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const pendingName = useRef<string | null>(null);

    const form = useForm<{ name: string; parent_id: number | null }>({
        name: '',
        parent_id: null,
    });

    // After a new category is persisted the page props refresh; select it.
    useEffect(() => {
        if (pendingName.current === null) {
            return;
        }

        const created = categories.find((c) => c.name === pendingName.current);

        if (created) {
            onChange(created.id);
            pendingName.current = null;
        }
    }, [categories, onChange]);

    function submit(event: React.FormEvent) {
        event.preventDefault();

        form.post(CategoryController.store().url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                pendingName.current = form.data.name;
                setOpen(false);
                form.reset();
            },
        });
    }

    return (
        <>
            <Combobox
                options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                    hint: category.parent_name ?? undefined,
                }))}
                value={value}
                onChange={onChange}
                placeholder="انتخاب دسته‌بندی"
                searchPlaceholder="جستجوی دسته‌بندی..."
                footer={
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-1.5"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="size-4" />
                        ایجاد دسته‌بندی جدید
                    </Button>
                }
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>دسته‌بندی جدید</DialogTitle>
                        <DialogDescription>
                            می‌توانید دسته‌بندی اصلی بسازید یا آن را زیرمجموعه یک
                            دسته‌بندی دیگر قرار دهید.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category-name">نام دسته‌بندی</Label>
                            <Input
                                id="category-name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>دسته‌بندی والد (اختیاری)</Label>
                            <Combobox
                                options={categories.map((category) => ({
                                    value: category.id,
                                    label: category.name,
                                }))}
                                value={form.data.parent_id}
                                onChange={(parentId) =>
                                    form.setData('parent_id', parentId)
                                }
                                placeholder="دسته‌بندی اصلی"
                                searchPlaceholder="جستجو..."
                            />
                            <InputError message={form.errors.parent_id} />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={form.processing}>
                                ایجاد
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
