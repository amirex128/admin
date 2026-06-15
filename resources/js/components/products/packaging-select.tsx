import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import PackagingTypeController from '@/actions/App/Http/Controllers/User/PackagingTypeController';
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
import { Textarea } from '@/components/ui/textarea';
import type { PackagingType } from '@/types';

/**
 * A searchable packaging-type picker that can create new packaging types
 * inline through a dialog.
 */
export function PackagingSelect({
    packagingTypes,
    value,
    onChange,
}: {
    packagingTypes: PackagingType[];
    value: number | null;
    onChange: (value: number | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const pendingName = useRef<string | null>(null);

    const form = useForm<{ name: string; description: string }>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (pendingName.current === null) {
            return;
        }

        const created = packagingTypes.find(
            (p) => p.name === pendingName.current,
        );

        if (created) {
            onChange(created.id);
            pendingName.current = null;
        }
    }, [packagingTypes, onChange]);

    function submit(event: React.FormEvent) {
        event.preventDefault();

        form.post(PackagingTypeController.store().url, {
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
                options={packagingTypes.map((type) => ({
                    value: type.id,
                    label: type.name,
                }))}
                value={value}
                onChange={onChange}
                placeholder="انتخاب نوع بسته‌بندی"
                searchPlaceholder="جستجوی بسته‌بندی..."
                footer={
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-1.5"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="size-4" />
                        ایجاد نوع بسته‌بندی جدید
                    </Button>
                }
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>نوع بسته‌بندی جدید</DialogTitle>
                        <DialogDescription>
                            نوع بسته‌بندی را برای استفاده در محصولات تعریف کنید.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="packaging-name">نام</Label>
                            <Input
                                id="packaging-name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="packaging-description">
                                توضیحات (اختیاری)
                            </Label>
                            <Textarea
                                id="packaging-description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={form.errors.description} />
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
