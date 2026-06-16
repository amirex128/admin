import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';

import AiModelController from '@/actions/App/Http/Controllers/Admin/AiModelController';
import { AiModelFormDialog } from '@/components/admin/ai-model-form-dialog';
import { useConfirm } from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';
import { index as adminAiModelsIndex } from '@/routes/admin/ai-models';
import type { AiModel, SelectOption } from '@/types';

type PageProps = {
    models: { data: AiModel[] };
    providers: SelectOption[];
};

export default function AdminAiSettings({ models, providers }: PageProps) {
    const confirm = useConfirm();

    function toggle(model: AiModel) {
        router.patch(
            AiModelController.toggle(model.id).url,
            {},
            { preserveScroll: true },
        );
    }

    async function destroy(model: AiModel) {
        if (
            !(await confirm({
                title: 'حذف مدل',
                description: `آیا از حذف مدل «${model.name}» مطمئن هستید؟`,
                confirmText: 'حذف',
            }))
        ) {
            return;
        }

        router.delete(AiModelController.destroy(model.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="تنظیمات هوش مصنوعی" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="تنظیمات هوش مصنوعی"
                        description="مدل‌های هوش مصنوعی، ارائه‌دهنده و قیمت هر یک را مدیریت کنید."
                    />
                    <AiModelFormDialog
                        providers={providers}
                        trigger={
                            <Button className="gap-1.5">
                                <Plus className="size-4" />
                                مدل جدید
                            </Button>
                        }
                    />
                </div>

                {models.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                        هنوز مدلی تعریف نشده است.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {models.data.map((model) => (
                            <Card
                                key={model.id}
                                className={cn(!model.is_active && 'opacity-70')}
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="size-4 text-primary" />
                                            {model.name}
                                        </span>
                                        <Badge variant="outline">
                                            {model.provider}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="font-mono text-xs text-muted-foreground">
                                        {model.model_identifier}
                                    </p>
                                    {model.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {model.description}
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-1 text-sm">
                                        <span className="font-semibold tabular-nums">
                                            {formatToman(
                                                model.price_per_1k_tokens,
                                            )}
                                        </span>
                                        <span className="text-muted-foreground">
                                            تومان / ۱۰۰۰ توکن
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-3 text-sm">
                                        <span className="text-muted-foreground">
                                            {model.users_count ?? 0} کاربر
                                        </span>
                                        <Switch
                                            checked={model.is_active}
                                            onCheckedChange={() =>
                                                toggle(model)
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <AiModelFormDialog
                                            model={model}
                                            providers={providers}
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 gap-1.5"
                                                >
                                                    <Pencil className="size-3.5" />
                                                    ویرایش
                                                </Button>
                                            }
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => destroy(model)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminAiSettings.layout = {
    breadcrumbs: [
        {
            title: 'تنظیمات هوش مصنوعی',
            href: adminAiModelsIndex(),
        },
    ],
};
