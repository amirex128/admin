import { cn } from '@/lib/utils';

/**
 * Tailwind classes for each semantic status color returned by the backend
 * OrderStatus enum.
 */
export const STATUS_COLOR_CLASSES: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
};

export function OrderStatusBadge({
    label,
    color,
    className,
}: {
    label: string;
    color: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                STATUS_COLOR_CLASSES[color] ?? STATUS_COLOR_CLASSES.gray,
                className,
            )}
        >
            {label}
        </span>
    );
}
