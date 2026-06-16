import { Head, router } from '@inertiajs/react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';

import PlanController from '@/actions/App/Http/Controllers/Admin/PlanController';
import { PlanFormDialog } from '@/components/admin/plan-form-dialog';
import { useConfirm } from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatToman } from '@/lib/format';
import { cn } from '@/lib/utils';
import { index as adminPlansIndex } from '@/routes/admin/plans';
import type { Plan } from '@/types';

type PageProps = {
    plans: { data: Plan[] };
};

export default function AdminPlansIndex({ plans }: PageProps) {
    const confirm = useConfirm();

    function toggle(plan: Plan) {
        router.patch(
            PlanController.toggle(plan.id).url,
            {},
            { preserveScroll: true },
        );
    }

    async function destroy(plan: Plan) {
        if (
            !(await confirm({
                title: 'حذف پلن',
                description: `آیا از حذف پلن «${plan.name}» مطمئن هستید؟`,
                confirmText: 'حذف',
            }))
        ) {
            return;
        }

        router.delete(PlanController.destroy(plan.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="مدیریت پلن‌های اشتراک" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="پلن‌های اشتراک"
                        description="پلن‌های اشتراک را ایجاد، ویرایش یا غیرفعال کنید."
                    />
                    <PlanFormDialog
                        trigger={
                            <Button className="gap-1.5">
                                <Plus className="size-4" />
                                پلن جدید
                            </Button>
                        }
                    />
                </div>

                {plans.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                        هنوز پلنی ایجاد نشده است.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {plans.data.map((plan) => (
                            <Card
                                key={plan.id}
                                className={cn(
                                    'relative',
                                    !plan.is_active && 'opacity-70',
                                    plan.is_featured && 'border-primary',
                                )}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {plan.name}
                                                {plan.is_featured && (
                                                    <Badge>ویژه</Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {plan.description ?? '—'}
                                            </CardDescription>
                                        </div>
                                        {plan.discount_badge && (
                                            <Badge variant="destructive">
                                                {plan.discount_badge}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-baseline gap-2">
                                        {plan.discount_percent ? (
                                            <>
                                                <span className="text-2xl font-bold tabular-nums">
                                                    {formatToman(
                                                        plan.discounted_price,
                                                    )}
                                                </span>
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {formatToman(plan.price)}
                                                </span>
                                                <Badge variant="secondary">
                                                    ٪{plan.discount_percent}
                                                </Badge>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold tabular-nums">
                                                {formatToman(plan.price)}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            تومان
                                        </span>
                                    </div>

                                    <ul className="space-y-1.5 text-sm">
                                        {plan.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2"
                                            >
                                                <Check className="size-4 text-emerald-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center justify-between border-t pt-3 text-sm">
                                        <span className="text-muted-foreground">
                                            {plan.subscriptions_count ?? 0}{' '}
                                            مشترک
                                        </span>
                                        <label className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {plan.is_active
                                                    ? 'فعال'
                                                    : 'غیرفعال'}
                                            </span>
                                            <Switch
                                                checked={plan.is_active}
                                                onCheckedChange={() =>
                                                    toggle(plan)
                                                }
                                            />
                                        </label>
                                    </div>

                                    <div className="flex gap-2">
                                        <PlanFormDialog
                                            plan={plan}
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
                                            onClick={() => destroy(plan)}
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

AdminPlansIndex.layout = {
    breadcrumbs: [
        {
            title: 'پلن‌های اشتراک',
            href: adminPlansIndex(),
        },
    ],
};
