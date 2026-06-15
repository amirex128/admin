/**
 * Format an integer Toman amount using Persian digits and grouping.
 */
export function formatToman(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount);
}

/**
 * Format an amount with the «تومان» suffix.
 */
export function formatTomanLabel(amount: number): string {
    return `${formatToman(amount)} تومان`;
}

/**
 * Format an ISO date string as a Persian (Jalali) date.
 */
export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(value));
}

/**
 * Format an ISO date string as a Persian date and time.
 */
export function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}
