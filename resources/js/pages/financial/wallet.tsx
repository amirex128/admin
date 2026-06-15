import { Head, useForm } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from 'lucide-react';

import { TransactionsTable } from '@/components/financial/transactions-table';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { PaginationNav } from '@/components/pagination-nav';
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
import { formatToman, formatTomanLabel } from '@/lib/format';
import { charge as chargeWallet, index as walletIndex } from '@/routes/wallet';
import type { Paginated, WalletTransaction } from '@/types';

type PageProps = {
    balance: number;
    transactions: Paginated<WalletTransaction>;
    stats: { total_credited: number; total_debited: number };
};

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export default function WalletPage({
    balance,
    transactions,
    stats,
}: PageProps) {
    const form = useForm<{ amount: string }>({ amount: '' });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        form.post(chargeWallet().url, {
            preserveScroll: true,
            onSuccess: () => form.reset('amount'),
        });
    }

    return (
        <>
            <Head title="کیف پول" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="کیف پول"
                    description="موجودی، شارژ کیف پول و تاریخچه تراکنش‌های مالی شما."
                />

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground lg:col-span-1">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-primary-foreground/80">
                                    موجودی فعلی
                                </CardDescription>
                                <Wallet className="size-5" />
                            </div>
                            <CardTitle className="text-3xl tabular-nums">
                                {formatTomanLabel(balance)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardDescription>مجموع واریز</CardDescription>
                                <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <ArrowDownLeft className="size-4" />
                                </span>
                            </div>
                            <CardTitle className="text-2xl text-emerald-600 tabular-nums dark:text-emerald-400">
                                {formatToman(stats.total_credited)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardDescription>مجموع برداشت</CardDescription>
                                <span className="flex size-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    <ArrowUpRight className="size-4" />
                                </span>
                            </div>
                            <CardTitle className="text-2xl text-rose-600 tabular-nums dark:text-rose-400">
                                {formatToman(stats.total_debited)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            شارژ کیف پول
                        </CardTitle>
                        <CardDescription>
                            مبلغ مورد نظر را وارد یا انتخاب کنید.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="amount">مبلغ (تومان)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    inputMode="numeric"
                                    min={10000}
                                    value={form.data.amount}
                                    onChange={(event) =>
                                        form.setData(
                                            'amount',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="حداقل ۱۰٬۰۰۰ تومان"
                                    required
                                />
                                <InputError message={form.errors.amount} />
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_AMOUNTS.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() =>
                                                form.setData(
                                                    'amount',
                                                    String(amount),
                                                )
                                            }
                                            className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {formatToman(amount)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full gap-1.5 sm:w-auto"
                            >
                                <Plus className="size-4" />
                                شارژ کیف پول
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">تاریخچه تراکنش‌ها</h2>
                    <TransactionsTable transactions={transactions.data} />
                    <PaginationNav links={transactions.links} />
                </div>
            </div>
        </>
    );
}

WalletPage.layout = {
    breadcrumbs: [
        {
            title: 'کیف پول',
            href: walletIndex(),
        },
    ],
};
