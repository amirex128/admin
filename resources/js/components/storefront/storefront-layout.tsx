import { Head, Link } from '@inertiajs/react';
import { Menu, Phone, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

import { useCart } from '@/lib/storefront-cart';
import type { StorefrontStore } from '@/types';

/**
 * Build a storefront URL for the given store key and path.
 */
export function shopUrl(key: string, path = ''): string {
    return `/shop/${key}${path}`;
}

const PAGE_LINKS: { slug: string; label: string }[] = [
    { slug: 'about', label: 'درباره ما' },
    { slug: 'buying-guide', label: 'راهنمای خرید' },
    { slug: 'return-policy', label: 'شرایط بازگشت' },
    { slug: 'terms', label: 'قوانین و مقررات' },
];

/**
 * Shared storefront chrome (header with category menu + cart, and a footer with
 * store info, social links, badges and content-page links) for the classic
 * template.
 */
export function StorefrontLayout({
    store,
    title,
    description,
    children,
}: {
    store: StorefrontStore;
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const { count } = useCart(store.key);
    const [menuOpen, setMenuOpen] = useState(false);

    const pageTitle = title ? `${title} | ${store.name}` : store.name;

    return (
        <div dir="rtl" className="storefront-scope flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
            <Head title={pageTitle}>
                {description && <meta name="description" content={description} />}
                <meta property="og:title" content={pageTitle} />
                {description && (
                    <meta property="og:description" content={description} />
                )}
                <meta property="og:type" content="website" />
            </Head>

            <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
                    <Link
                        href={shopUrl(store.key)}
                        className="text-lg font-bold text-primary"
                    >
                        {store.name}
                    </Link>

                    <nav className="hidden flex-1 items-center gap-4 lg:flex">
                        {store.categories.slice(0, 6).map((category) => (
                            <Link
                                key={category.id}
                                href={shopUrl(
                                    store.key,
                                    `/categories/${category.id}`,
                                )}
                                className="text-sm text-neutral-600 hover:text-primary"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="ms-auto flex items-center gap-2">
                        <Link
                            href={shopUrl(store.key, '/track')}
                            className="hidden rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 sm:inline-flex"
                        >
                            <Search className="ms-1 size-4" />
                            پیگیری سفارش
                        </Link>
                        <Link
                            href={shopUrl(
                                store.key,
                                store.customer ? '/account' : '/login',
                            )}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
                        >
                            <User className="size-4" />
                            {store.customer ? store.customer.name : 'ورود'}
                        </Link>
                        <Link
                            href={shopUrl(store.key, '/cart')}
                            className="relative inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                        >
                            <ShoppingCart className="size-4" />
                            سبد خرید
                            {count > 0 && (
                                <span className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full bg-rose-600 text-xs text-white">
                                    {count}
                                </span>
                            )}
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="rounded-md p-2 hover:bg-neutral-100 lg:hidden"
                            aria-label="منو"
                        >
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav className="flex flex-col gap-1 border-t px-4 py-2 lg:hidden">
                        {store.categories.map((category) => (
                            <Link
                                key={category.id}
                                href={shopUrl(
                                    store.key,
                                    `/categories/${category.id}`,
                                )}
                                className="rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
                {children}
            </main>

            <footer className="border-t bg-white">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <h3 className="font-bold text-primary">{store.name}</h3>
                        {store.business_type && (
                            <p className="text-sm text-neutral-600">
                                {store.business_type}
                            </p>
                        )}
                        {store.phone && (
                            <p className="flex items-center gap-1 text-sm text-neutral-600">
                                <Phone className="size-4" />
                                {store.phone}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">دسترسی سریع</h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                            {PAGE_LINKS.filter(
                                (page) => store.pages[page.slug],
                            ).map((page) => (
                                <li key={page.slug}>
                                    <Link
                                        href={shopUrl(
                                            store.key,
                                            `/pages/${page.slug}`,
                                        )}
                                        className="hover:text-primary"
                                    >
                                        {page.label}
                                    </Link>
                                </li>
                            ))}
                            {store.pages.faq && (
                                <li>
                                    <Link
                                        href={shopUrl(store.key, '/faq')}
                                        className="hover:text-primary"
                                    >
                                        سوالات متداول
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">شبکه‌های اجتماعی</h4>
                        <ul className="space-y-1 text-sm text-neutral-600">
                            {Object.entries(store.socials)
                                .filter(([, value]) => value)
                                .map(([key, value]) => (
                                    <li key={key}>
                                        <a
                                            href={value as string}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:text-primary"
                                        >
                                            {key}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">نمادها و مجوزها</h4>
                        <div className="flex flex-wrap gap-2">
                            {store.badges.map((badge, index) => (
                                <div
                                    key={index}
                                    title={badge.title}
                                    dangerouslySetInnerHTML={{
                                        __html: badge.html,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t py-4 text-center text-xs text-neutral-500">
                    طراحی شده با دیجی‌فای
                </div>
            </footer>
        </div>
    );
}
