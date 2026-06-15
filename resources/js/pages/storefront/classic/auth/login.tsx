import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import type { StorefrontStore } from '@/types';

const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none';

export default function StorefrontLogin({ store }: { store: StorefrontStore }) {
    const form = useForm({ phone: '', password: '', remember: false });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(shopUrl(store.key, '/login'));
    }

    return (
        <StorefrontLayout store={store} title="ورود">
            <div className="mx-auto max-w-sm">
                <h1 className="mb-5 text-xl font-bold">ورود به حساب</h1>
                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-2xl border bg-white p-5"
                >
                    <div className="space-y-1.5">
                        <label className="text-sm">شماره موبایل</label>
                        <input
                            className={inputClass}
                            dir="ltr"
                            value={form.data.phone}
                            onChange={(e) =>
                                form.setData('phone', e.target.value)
                            }
                        />
                        {form.errors.phone && (
                            <p className="text-xs text-rose-600">
                                {form.errors.phone}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm">رمز عبور</label>
                        <input
                            type="password"
                            className={inputClass}
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-primary-foreground hover:opacity-90"
                    >
                        {form.processing && (
                            <Loader2 className="size-4 animate-spin" />
                        )}
                        ورود
                    </button>
                    <p className="text-center text-sm text-neutral-500">
                        حساب ندارید؟{' '}
                        <Link
                            href={shopUrl(store.key, '/register')}
                            className="text-primary hover:underline"
                        >
                            ثبت‌نام
                        </Link>
                    </p>
                </form>
            </div>
        </StorefrontLayout>
    );
}
