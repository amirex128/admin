import { Head, Link, router } from '@inertiajs/react';
import { Check, Sparkles, Wallet } from 'lucide-react';

import { useConfirm } from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatToman, formatTomanLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { index as plansIndex, subscribe } from '@/routes/plans';
import { index as walletIndex } from '@/routes/wallet';
import type { Plan, Subscription } from '@/types';

const PERIOD_LABELS: Record<string, string> = {
    monthly: 'ماهانه',
    quarterly: 'سه‌ماهه',
    yearly: 'سالانه',
    lifetime: 'مادام‌العمر',
};

type PageProps = {
    plans: { data: Plan[] };
    balance: number;
    activeSubscription: Subscription | null;
};

export default function PlansPage({
    plans,
    balance,
    activeSubscription,
}: PageProps) {
    const confirm = useConfirm();

    async function choose(plan: Plan) {
        if (plan.discounted_price > balance) {
            if (
                await confirm({
                    title: 'موجودی ناکافی',
                    description:
                        'موجودی کیف پول شما کافی نیست. به صفحه شارژ منتقل می‌شوید؟',
                    confirmText: 'شارژ کیف پول',
                    destructive: false,
                })
            ) {
                router.visit(walletIndex().url);
            }

            return;
        }

        if (
            await confirm({
                title: 'تایید خرید اشتراک',
                description: `خرید اشتراک «${plan.name}» را تأیید می‌کنید؟`,
                confirmText: 'خرید',
                destructive: false,
            })
        ) {
            router.post(subscribe(plan.id).url, {}, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="پلن‌های اشتراک" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title="پلن‌های اشتراک"
                        description="پلن مناسب خود را انتخاب کنید و از امکانات ویژه بهره‌مند شوید."
                    />
                    <Link
                        href={walletIndex()}
                        className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                        <Wallet className="size-4 text-primary" />
                        موجودی: {formatTomanLabel(balance)}
                    </Link>
                </div>

                {activeSubscription && (
                    <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                        <Sparkles className="size-5 text-primary" />
                        <span>
                            اشتراک فعال شما:{' '}
                            <strong>{activeSubscription.plan?.name}</strong>
                        </span>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {plans.data.map((plan) => {
                        const isCurrent =
                            activeSubscription?.plan?.id === plan.id;
                        const hasDiscount = Boolean(plan.discount_percent);

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    'relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
                                    plan.is_featured &&
                                        'border-primary shadow-md ring-1 ring-primary/20',
                                )}
                            >
                                {plan.discount_badge && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-3 right-6"
                                    >
                                        {plan.discount_badge}
                                    </Badge>
                                )}

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">
                                            {plan.name}
                                        </h3>
                                        {plan.is_featured && (
                                            <Badge className="gap-1">
                                                <Sparkles className="size-3" />
                                                پیشنهادی
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-end gap-2">
                                    <span className="text-3xl font-extrabold tabular-nums">
                                        {formatToman(plan.discounted_price)}
                                    </span>
                                    <span className="pb-1 text-sm text-muted-foreground">
                                        تومان /{' '}
                                        {PERIOD_LABELS[plan.billing_period] ??
                                            plan.billing_period}
                                    </span>
                                </div>
                                {hasDiscount && (
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground line-through">
                                            {formatToman(plan.price)}
                                        </span>
                                        <Badge variant="secondary">
                                            ٪{plan.discount_percent} تخفیف
                                        </Badge>
                                    </div>
                                )}

                                <ul className="mt-6 flex-1 space-y-3 text-sm">
                                    {plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                <Check className="size-3.5" />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="mt-6 w-full"
                                    variant={
                                        plan.is_featured ? 'default' : 'outline'
                                    }
                                    disabled={isCurrent}
                                    onClick={() => choose(plan)}
                                >
                                    {isCurrent
                                        ? 'اشتراک فعلی شما'
                                        : 'انتخاب پلن'}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {plans.data.length === 0 && (
                    <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                        در حال حاضر پلن فعالی موجود نیست.
                    </div>
                )}
            </div>
        </>
    );
}

PlansPage.layout = {
    breadcrumbs: [
        {
            title: 'پلن‌های اشتراک',
            href: plansIndex(),
        },
    ],
};
