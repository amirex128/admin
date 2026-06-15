import { Head, router } from '@inertiajs/react';
import { Check, Sparkles, Wallet } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';
import { edit as aiSettings } from '@/routes/settings/ai';
import type { AiModel } from '@/types';

type PageProps = {
    models: { data: AiModel[] };
    selectedModelId: number | null;
    balance: number;
};

export default function AiSettings({
    models,
    selectedModelId,
    balance,
}: PageProps) {
    function select(modelId: number | null) {
        router.put(
            aiSettings().url,
            { ai_model_id: modelId },
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="تنظیمات هوش مصنوعی" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="تنظیمات هوش مصنوعی"
                    description="مدل هوش مصنوعی پنل خود را انتخاب کنید. هزینه هر درخواست بر اساس توکن مصرفی از کیف پول کسر می‌شود."
                />

                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
                    <Wallet className="size-4 text-muted-foreground" />
                    موجودی کیف پول:
                    <span className="font-semibold tabular-nums">
                        {formatToman(balance)} تومان
                    </span>
                </div>

                {models.data.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        در حال حاضر مدلی در دسترس نیست.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {models.data.map((model) => {
                            const isSelected = model.id === selectedModelId;

                            return (
                                <Card
                                    key={model.id}
                                    className={cn(
                                        'relative transition',
                                        isSelected && 'border-primary ring-1 ring-primary',
                                    )}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="size-4 text-primary" />
                                                {model.name}
                                            </span>
                                            {isSelected && (
                                                <Badge className="gap-1">
                                                    <Check className="size-3" />
                                                    انتخاب شده
                                                </Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
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
                                                تومان به ازای هر ۱۰۰۰ توکن
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant={
                                                isSelected
                                                    ? 'secondary'
                                                    : 'default'
                                            }
                                            size="sm"
                                            className="w-full"
                                            disabled={isSelected}
                                            onClick={() => select(model.id)}
                                        >
                                            {isSelected
                                                ? 'مدل فعلی شما'
                                                : 'انتخاب این مدل'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

AiSettings.layout = {
    breadcrumbs: [
        {
            title: 'تنظیمات هوش مصنوعی',
            href: aiSettings(),
        },
    ],
};
