import { Link } from '@inertiajs/react';

import { cn } from '@/lib/utils';
import type { PaginationLink } from '@/types';

/**
 * Renders the pagination links produced by a Laravel paginator. Labels arrive
 * already localized (« Previous / Next ») from the backend.
 */
export function PaginationNav({
    links,
    className,
}: {
    links: PaginationLink[];
    className?: string;
}) {
    // Hide the control entirely when there is only a single page.
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className={cn('flex flex-wrap items-center gap-1', className)}
            aria-label="صفحه‌بندی"
        >
            {links.map((link, index) => {
                const label = link.label
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»')
                    .replace('pagination.previous', 'قبلی')
                    .replace('pagination.next', 'بعدی');

                const baseClass = cn(
                    'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors',
                    link.active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
                    !link.url && 'pointer-events-none opacity-50',
                );

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className={baseClass}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={baseClass}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
