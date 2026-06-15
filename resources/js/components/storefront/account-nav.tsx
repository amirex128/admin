import { Link } from '@inertiajs/react';
import { LogOut, Package, UserCog } from 'lucide-react';

import { shopUrl } from '@/components/storefront/storefront-layout';
import type { StorefrontStore } from '@/types';

/**
 * Sidebar navigation for the storefront customer panel.
 */
export function AccountNav({
    store,
    active,
}: {
    store: StorefrontStore;
    active: 'orders' | 'profile';
}) {
    const linkClass = (key: string) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
            active === key
                ? 'bg-primary/10 text-primary'
                : 'text-neutral-600 hover:bg-neutral-100'
        }`;

    return (
        <nav className="flex h-fit flex-col gap-1 rounded-xl border bg-white p-2">
            <Link href={shopUrl(store.key, '/account')} className={linkClass('orders')}>
                <Package className="size-4" />
                سفارش‌های من
            </Link>
            <Link
                href={shopUrl(store.key, '/account/profile')}
                className={linkClass('profile')}
            >
                <UserCog className="size-4" />
                اطلاعات کاربری
            </Link>
            <Link
                href={shopUrl(store.key, '/logout')}
                method="post"
                as="button"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-right text-sm text-rose-600 hover:bg-rose-50"
            >
                <LogOut className="size-4" />
                خروج
            </Link>
        </nav>
    );
}
