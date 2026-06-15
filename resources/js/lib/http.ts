/**
 * Read a cookie value by name.
 */
function cookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp('(^|;\\s*)' + name + '=([^;]*)'),
    );

    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * The headers required to satisfy Laravel's CSRF protection for XHR requests.
 */
function csrfHeaders(): Record<string, string> {
    const token = cookie('XSRF-TOKEN');

    return token ? { 'X-XSRF-TOKEN': token } : {};
}

export class HttpError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly body: unknown,
    ) {
        super(message);
    }
}

async function parse(response: Response): Promise<unknown> {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return null;
    }
}

/**
 * Send a JSON POST request, throwing an HttpError on a non-2xx response.
 */
export async function postJson<T>(
    url: string,
    body: Record<string, unknown>,
): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...csrfHeaders(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });

    const data = await parse(response);

    if (!response.ok) {
        const message =
            (data as { message?: string })?.message ?? 'خطایی رخ داد.';

        throw new HttpError(message, response.status, data);
    }

    return data as T;
}

/**
 * Send a multipart POST request (file uploads), throwing on failure.
 */
export async function postForm<T>(url: string, form: FormData): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...csrfHeaders(),
        },
        credentials: 'same-origin',
        body: form,
    });

    const data = await parse(response);

    if (!response.ok) {
        const message =
            (data as { message?: string })?.message ?? 'خطایی رخ داد.';

        throw new HttpError(message, response.status, data);
    }

    return data as T;
}
