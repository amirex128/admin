import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Customer, CustomerStatusOption } from '@/types';

type Props = {
    trigger: React.ReactNode;
    statuses: CustomerStatusOption[];
    /** URL the form posts to. */
    submitUrl: string;
    /** HTTP verb: `post` to create, `put` to update. */
    method: 'post' | 'put';
    /** When provided the dialog edits this customer. */
    customer?: Customer;
};

/**
 * A create/edit dialog for a CRM customer, reused by the seller and admin
 * panels — only the submit URL and method differ.
 */
export function CustomerFormDialog({
    trigger,
    statuses,
    submitUrl,
    method,
    customer,
}: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, submit, processing, errors, reset, clearErrors } =
        useForm({
            name: customer?.name ?? '',
            phone: customer?.phone ?? '',
            email: customer?.email ?? '',
            national_code: customer?.national_code ?? '',
            province: customer?.province ?? '',
            city: customer?.city ?? '',
            address: customer?.address ?? '',
            postal_code: customer?.postal_code ?? '',
            status: customer?.status ?? statuses[0]?.value ?? 'active',
            note: customer?.note ?? '',
        });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        submit(method, submitUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);

                if (method === 'post') {
                    reset();
                }
            },
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (!next) {
                    clearErrors();

                    if (method === 'post') {
                        reset();
                    }
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {customer ? 'ویرایش مشتری' : 'مشتری جدید'}
                    </DialogTitle>
                    <DialogDescription>
                        اطلاعات تماس و نشانی مشتری را برای صدور سفارش و پیش‌فاکتور
                        وارد کنید.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="نام مشتری"
                            required
                            error={errors.name}
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="نام و نام خانوادگی"
                            />
                        </Field>
                        <Field label="موبایل" error={errors.phone}>
                            <Input
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                placeholder="09xxxxxxxxx"
                                inputMode="numeric"
                            />
                        </Field>
                        <Field label="ایمیل" error={errors.email}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="email@example.com"
                            />
                        </Field>
                        <Field label="کد ملی" error={errors.national_code}>
                            <Input
                                value={data.national_code}
                                onChange={(e) =>
                                    setData('national_code', e.target.value)
                                }
                                inputMode="numeric"
                            />
                        </Field>
                        <Field label="استان" error={errors.province}>
                            <Input
                                value={data.province}
                                onChange={(e) =>
                                    setData('province', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="شهر" error={errors.city}>
                            <Input
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                            />
                        </Field>
                        <Field label="کد پستی" error={errors.postal_code}>
                            <Input
                                value={data.postal_code}
                                onChange={(e) =>
                                    setData('postal_code', e.target.value)
                                }
                                inputMode="numeric"
                            />
                        </Field>
                        <Field label="وضعیت" error={errors.status}>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                        </Field>
                    </div>

                    <Field label="آدرس" error={errors.address}>
                        <Textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={2}
                        />
                    </Field>

                    <Field label="یادداشت" error={errors.note}>
                        <Textarea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            rows={2}
                        />
                    </Field>

                    <DialogFooter className="gap-2">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-1.5"
                        >
                            {processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            ذخیره
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm">
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
