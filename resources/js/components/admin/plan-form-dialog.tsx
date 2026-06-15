import { useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import PlanController from '@/actions/App/Http/Controllers/Admin/PlanController';
import InputError from '@/components/input-error';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Plan } from '@/types';

type PlanFormData = {
    name: string;
    description: string;
    price: string;
    billing_period: string;
    duration_days: string;
    features: string[];
    discount_percent: string;
    discount_badge: string;
    is_active: boolean;
    is_featured: boolean;
    sort_order: string;
};

const BILLING_PERIODS: { value: string; label: string }[] = [
    { value: 'monthly', label: 'ماهانه' },
    { value: 'quarterly', label: 'سه‌ماهه' },
    { value: 'yearly', label: 'سالانه' },
    { value: 'lifetime', label: 'مادام‌العمر' },
];

/**
 * A create/edit dialog for subscription plans. When `plan` is provided it edits
 * that plan, otherwise it creates a new one.
 */
export function PlanFormDialog({
    plan,
    trigger,
}: {
    plan?: Plan;
    trigger: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const isEditing = plan !== undefined;

    const form = useForm<PlanFormData>({
        name: plan?.name ?? '',
        description: plan?.description ?? '',
        price: plan ? String(plan.price) : '',
        billing_period: plan?.billing_period ?? 'monthly',
        duration_days: plan ? String(plan.duration_days) : '30',
        features: plan?.features ?? [],
        discount_percent: plan?.discount_percent
            ? String(plan.discount_percent)
            : '',
        discount_badge: plan?.discount_badge ?? '',
        is_active: plan?.is_active ?? true,
        is_featured: plan?.is_featured ?? false,
        sort_order: plan ? String(plan.sort_order) : '0',
    });

    const [feature, setFeature] = useState('');

    function addFeature() {
        const value = feature.trim();

        if (value === '') {
            return;
        }

        form.setData('features', [...form.data.features, value]);
        setFeature('');
    }

    function removeFeature(index: number) {
        form.setData(
            'features',
            form.data.features.filter((_, i) => i !== index),
        );
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();

        const onSuccess = () => {
            setOpen(false);

            if (!isEditing) {
                form.reset();
            }
        };

        if (isEditing) {
            form.put(PlanController.update(plan.id).url, { onSuccess });
        } else {
            form.post(PlanController.store().url, { onSuccess });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'ویرایش پلن' : 'افزودن پلن جدید'}
                    </DialogTitle>
                    <DialogDescription>
                        مشخصات پلن اشتراک را وارد کنید.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">نام پلن</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            required
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                            id="description"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="price">قیمت (تومان)</Label>
                            <Input
                                id="price"
                                type="number"
                                min={0}
                                value={form.data.price}
                                onChange={(event) =>
                                    form.setData('price', event.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.price} />
                        </div>

                        <div className="grid gap-2">
                            <Label>دوره</Label>
                            <Select
                                value={form.data.billing_period}
                                onValueChange={(value) =>
                                    form.setData('billing_period', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {BILLING_PERIODS.map((period) => (
                                        <SelectItem
                                            key={period.value}
                                            value={period.value}
                                        >
                                            {period.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="duration_days">مدت (روز)</Label>
                            <Input
                                id="duration_days"
                                type="number"
                                min={1}
                                value={form.data.duration_days}
                                onChange={(event) =>
                                    form.setData(
                                        'duration_days',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError message={form.errors.duration_days} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">ترتیب نمایش</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={form.data.sort_order}
                                onChange={(event) =>
                                    form.setData(
                                        'sort_order',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="discount_percent">درصد تخفیف</Label>
                            <Input
                                id="discount_percent"
                                type="number"
                                min={0}
                                max={100}
                                value={form.data.discount_percent}
                                onChange={(event) =>
                                    form.setData(
                                        'discount_percent',
                                        event.target.value,
                                    )
                                }
                                placeholder="اختیاری"
                            />
                            <InputError
                                message={form.errors.discount_percent}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="discount_badge">بج تخفیف</Label>
                            <Input
                                id="discount_badge"
                                value={form.data.discount_badge}
                                onChange={(event) =>
                                    form.setData(
                                        'discount_badge',
                                        event.target.value,
                                    )
                                }
                                placeholder="مثلاً پرفروش"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>ویژگی‌ها</Label>
                        <div className="flex gap-2">
                            <Input
                                value={feature}
                                onChange={(event) =>
                                    setFeature(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        addFeature();
                                    }
                                }}
                                placeholder="افزودن ویژگی"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={addFeature}
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>
                        <ul className="space-y-1">
                            {form.data.features.map((item, index) => (
                                <li
                                    key={`${item}-${index}`}
                                    className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-sm"
                                >
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label>پلن فعال است</Label>
                            <p className="text-xs text-muted-foreground">
                                پلن‌های غیرفعال به کاربران نمایش داده نمی‌شوند.
                            </p>
                        </div>
                        <Switch
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label>پلن ویژه</Label>
                            <p className="text-xs text-muted-foreground">
                                پلن‌های ویژه با برجستگی نمایش داده می‌شوند.
                            </p>
                        </div>
                        <Switch
                            checked={form.data.is_featured}
                            onCheckedChange={(checked) =>
                                form.setData('is_featured', checked)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            {isEditing ? 'ذخیره تغییرات' : 'ایجاد پلن'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
