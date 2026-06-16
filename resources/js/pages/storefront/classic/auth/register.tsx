import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import type { StorefrontStore } from '@/types';

const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none';

export default function StorefrontRegister({
    store,
}: {
    store: StorefrontStore;
}) {
    const form = useForm({
        name: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(shopUrl(store.key, '/register'));
    }

    return (
        <StorefrontLayout store={store} title="ثبت‌نام">
            <div className="mx-auto max-w-sm">
                <h1 className="mb-5 text-xl font-bold">ساخت حساب</h1>
                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-2xl border bg-white p-5"
                >
                    <div className="space-y-1.5">
                        <label className="text-sm">نام و نام خانوادگی</label>
                        <input
                            className={inputClass}
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        {form.errors.name && (
                            <p className="text-xs text-rose-600">
                                {form.errors.name}
                            </p>
                        )}
                    </div>
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
                        {form.errors.password && (
                            <p className="text-xs text-rose-600">
                                {form.errors.password}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm">تکرار رمز عبور</label>
                        <input
                            type="password"
                            className={inputClass}
                            value={form.data.password_confirmation}
                            onChange={(e) =>
                                form.setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
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
                        ثبت‌نام
                    </button>
                    <p className="text-center text-sm text-neutral-500">
                        حساب دارید؟{' '}
                        <Link
                            href={shopUrl(store.key, '/login')}
                            className="text-primary hover:underline"
                        >
                            ورود
                        </Link>
                    </p>
                </form>
            </div>
        </StorefrontLayout>
    );
}
