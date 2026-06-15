import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    ClipboardList,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

import UserWalletController from '@/actions/App/Http/Controllers/Admin/UserWalletController';
import { TransactionsTable } from '@/components/financial/transactions-table';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { PaginationNav } from '@/components/pagination-nav';
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, formatTomanLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { index as adminUsersIndex } from '@/routes/admin/users';
import type { Paginated, Subscription, WalletTransaction } from '@/types';

type AdminUser = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    is_admin: boolean;
    referral_code: string | null;
    created_at: string;
};

type PageProps = {
    user: AdminUser;
    balance: number;
    transactions: Paginated<WalletTransaction>;
    subscriptions: { data: Subscription[] };
};

export default function AdminUserShow({
    user,
    balance,
    transactions,
    subscriptions,
}: PageProps) {
    const [type, setType] = useState<'credit' | 'debit'>('credit');

    const form = useForm<{
        type: 'credit' | 'debit';
        amount: string;
        description: string;
    }>({
        type: 'credit',
        amount: '',
        description: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        form.transform((data) => ({ ...data, type }));
        form.post(UserWalletController.store(user.id).url, {
            preserveScroll: true,
            onSuccess: () => form.reset('amount', 'description'),
        });
    }

    const activeSubscription = subscriptions.data.find(
        (item) => item.is_active,
    );

    return (
        <>
            <Head title={`مدیریت ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading
                        title={user.name}
                        description="هاب مدیریت کاربر: مشاهده تراکنش‌ها، سفارش‌ها و تنظیم موجودی کیف پول."
                    />
                    <Button asChild variant="outline" className="gap-1.5">
                        <Link
                            href={`${adminOrdersIndex().url}?user=${user.id}`}
                        >
                            <ClipboardList className="size-4" />
                            سفارش‌های کاربر
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardDescription>
                                    موجودی کیف پول
                                </CardDescription>
                                <CardTitle className="mt-1 text-2xl tabular-nums">
                                    {formatTomanLabel(balance)}
                                </CardTitle>
                            </div>
                            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Wallet className="size-5" />
                            </span>
                        </CardHeader>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">
                                اطلاعات کاربر
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                            <Info label="موبایل" value={user.phone} dir="ltr" />
                            <Info label="ایمیل" value={user.email ?? '—'} />
                            <Info
                                label="کد معرف"
                                value={user.referral_code ?? '—'}
                            />
                            <Info
                                label="تاریخ عضویت"
                                value={formatDate(user.created_at)}
                            />
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="transactions">
                    <TabsList>
                        <TabsTrigger value="transactions">
                            صورت تراکنش‌ها
                        </TabsTrigger>
                        <TabsTrigger value="adjust">تنظیم موجودی</TabsTrigger>
                        <TabsTrigger value="subscriptions">
                            اشتراک‌ها
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transactions" className="space-y-4">
                        <TransactionsTable
                            transactions={transactions.data}
                            showPerformer
                        />
                        <PaginationNav links={transactions.links} />
                    </TabsContent>

                    <TabsContent value="adjust">
                        <Card className="max-w-xl">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    افزایش یا کاهش موجودی
                                </CardTitle>
                                <CardDescription>
                                    مبلغ مورد نظر به کیف پول کاربر اضافه یا از
                                    آن کسر می‌شود و در صورت تراکنش‌ها ثبت
                                    می‌گردد.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-2">
                                        <TypeButton
                                            active={type === 'credit'}
                                            onClick={() => setType('credit')}
                                            tone="credit"
                                        >
                                            <ArrowDownLeft className="size-4" />
                                            افزایش موجودی
                                        </TypeButton>
                                        <TypeButton
                                            active={type === 'debit'}
                                            onClick={() => setType('debit')}
                                            tone="debit"
                                        >
                                            <ArrowUpRight className="size-4" />
                                            کاهش موجودی
                                        </TypeButton>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">
                                            مبلغ (تومان)
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            inputMode="numeric"
                                            min={1}
                                            value={form.data.amount}
                                            onChange={(event) =>
                                                form.setData(
                                                    'amount',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="مثلاً ۵۰۰۰۰"
                                            required
                                        />
                                        <InputError
                                            message={form.errors.amount}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            توضیحات (اختیاری)
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={form.data.description}
                                            onChange={(event) =>
                                                form.setData(
                                                    'description',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="دلیل تغییر موجودی"
                                        />
                                        <InputError
                                            message={form.errors.description}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        ثبت تغییر موجودی
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscriptions" className="space-y-3">
                        {activeSubscription ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        {activeSubscription.plan?.name}
                                        <Badge variant="secondary">فعال</Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        مبلغ پرداختی:{' '}
                                        {formatTomanLabel(
                                            activeSubscription.price_paid,
                                        )}{' '}
                                        · پایان:{' '}
                                        {formatDate(activeSubscription.ends_at)}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) : (
                            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                                این کاربر اشتراک فعالی ندارد.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

function Info({
    label,
    value,
    dir,
}: {
    label: string;
    value: string;
    dir?: 'ltr' | 'rtl';
}) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-0.5 font-medium" dir={dir}>
                {value}
            </p>
        </div>
    );
}

function TypeButton({
    active,
    onClick,
    tone,
    children,
}: {
    active: boolean;
    onClick: () => void;
    tone: 'credit' | 'debit';
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                active
                    ? tone === 'credit'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-input text-muted-foreground hover:bg-accent',
            )}
        >
            {children}
        </button>
    );
}

AdminUserShow.layout = {
    breadcrumbs: [
        {
            title: 'مدیریت کاربران',
            href: adminUsersIndex(),
        },
        {
            title: 'جزئیات کاربر',
            href: adminUsersIndex(),
        },
    ],
};
