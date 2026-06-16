import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Package, ShieldCheck, Store } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const FEATURES = [
    {
        icon: Store,
        title: 'فروشگاه‌ساز اختصاصی',
        description: 'برای هر فروشنده یک فروشگاه با دامنه و قالب مستقل.',
    },
    {
        icon: Package,
        title: 'مدیریت کامل محصولات',
        description: 'تنوع، موجودی، قیمت‌گذاری و ورود/خروج اکسل.',
    },
    {
        icon: BarChart3,
        title: 'سفارش‌ها و گزارش‌ها',
        description: 'پیگیری سفارش‌ها، پرداخت‌ها و کیف پول در یک‌جا.',
    },
    {
        icon: ShieldCheck,
        title: 'امن و سریع',
        description: 'احراز هویت مطمئن و تجربه‌ای روان و بهینه.',
    },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="grid min-h-dvh lg:grid-cols-2">
            {/* Branded showcase panel */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-primary via-primary to-primary/70" />
                <div
                    className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-white/10 blur-3xl"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-32 -right-16 size-[28rem] rounded-full bg-black/10 blur-3xl"
                    aria-hidden
                />

                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-2 text-lg font-bold"
                >
                    <AppLogoIcon className="size-9 fill-current" />
                    {name}
                </Link>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold leading-tight">
                            پلتفرم جامع مدیریت فروشگاه و فروش آنلاین
                        </h2>
                        <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
                            همه‌چیز برای راه‌اندازی و مدیریت کسب‌وکار آنلاین شما؛
                            از ساخت فروشگاه و مدیریت محصولات تا سفارش‌ها، پرداخت و
                            باشگاه مشتریان.
                        </p>
                    </div>

                    <ul className="grid gap-4 sm:grid-cols-2">
                        {FEATURES.map((feature) => (
                            <li
                                key={feature.title}
                                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                            >
                                <feature.icon className="mb-2 size-6" />
                                <p className="font-semibold">{feature.title}</p>
                                <p className="text-xs text-primary-foreground/75">
                                    {feature.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative z-10 text-xs text-primary-foreground/60">
                    © {new Date().getFullYear()} {name}
                </p>
            </div>

            {/* Form panel */}
            <div className="flex w-full items-center justify-center bg-background p-6 sm:p-10">
                <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-6">
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="size-10 fill-current text-primary" />
                        <span className="text-lg font-bold">{name}</span>
                    </Link>
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
