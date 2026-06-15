import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import AiModelController from '@/actions/App/Http/Controllers/Admin/AiModelController';
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
import type { AiModel, SelectOption } from '@/types';

type AiModelFormData = {
    name: string;
    provider: string;
    model_identifier: string;
    description: string;
    price_per_1k_tokens: string;
    is_active: boolean;
    sort_order: string;
};

export function AiModelFormDialog({
    model,
    providers,
    trigger,
}: {
    model?: AiModel;
    providers: SelectOption[];
    trigger: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const isEditing = model !== undefined;

    const form = useForm<AiModelFormData>({
        name: model?.name ?? '',
        provider: model?.provider ?? providers[0]?.value ?? '',
        model_identifier: model?.model_identifier ?? '',
        description: model?.description ?? '',
        price_per_1k_tokens: model ? String(model.price_per_1k_tokens) : '',
        is_active: model?.is_active ?? true,
        sort_order: model ? String(model.sort_order) : '0',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        const onSuccess = () => {
            setOpen(false);

            if (!isEditing) {
                form.reset();
            }
        };

        if (isEditing) {
            form.put(AiModelController.update(model.id).url, { onSuccess });
        } else {
            form.post(AiModelController.store().url, { onSuccess });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'ویرایش مدل' : 'افزودن مدل هوش مصنوعی'}
                    </DialogTitle>
                    <DialogDescription>
                        مدل، ارائه‌دهنده و قیمت هر ۱۰۰۰ توکن را مشخص کنید.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">نام نمایشی</Label>
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

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>ارائه‌دهنده</Label>
                            <Select
                                value={form.data.provider}
                                onValueChange={(value) =>
                                    form.setData('provider', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {providers.map((provider) => (
                                        <SelectItem
                                            key={provider.value}
                                            value={provider.value}
                                        >
                                            {provider.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.provider} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model_identifier">
                                شناسه مدل
                            </Label>
                            <Input
                                id="model_identifier"
                                value={form.data.model_identifier}
                                onChange={(event) =>
                                    form.setData(
                                        'model_identifier',
                                        event.target.value,
                                    )
                                }
                                placeholder="gpt-4o-mini"
                                required
                            />
                            <InputError
                                message={form.errors.model_identifier}
                            />
                        </div>
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
                            <Label htmlFor="price_per_1k_tokens">
                                قیمت هر ۱۰۰۰ توکن (تومان)
                            </Label>
                            <Input
                                id="price_per_1k_tokens"
                                type="number"
                                min={0}
                                value={form.data.price_per_1k_tokens}
                                onChange={(event) =>
                                    form.setData(
                                        'price_per_1k_tokens',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={form.errors.price_per_1k_tokens}
                            />
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

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label>فعال</Label>
                            <p className="text-xs text-muted-foreground">
                                مدل‌های غیرفعال به کاربران نمایش داده نمی‌شوند.
                            </p>
                        </div>
                        <Switch
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked)
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            {isEditing ? 'ذخیره تغییرات' : 'ایجاد مدل'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
