import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

import { AccountNav } from '@/components/storefront/account-nav';
import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import type { StorefrontStore } from '@/types';

const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none';

type Customer = {
    name: string;
    phone: string | null;
    email: string | null;
    province: string | null;
    city: string | null;
    address: string | null;
};

type PageProps = {
    store: StorefrontStore;
    customer: Customer;
};

export default function AccountProfile({ store, customer }: PageProps) {
    const profile = useForm({
        name: customer.name ?? '',
        email: customer.email ?? '',
        province: customer.province ?? '',
        city: customer.city ?? '',
        address: customer.address ?? '',
    });

    const password = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function saveProfile(event: React.FormEvent) {
        event.preventDefault();
        profile.put(shopUrl(store.key, '/account/profile'), {
            preserveScroll: true,
        });
    }

    function savePassword(event: React.FormEvent) {
        event.preventDefault();
        password.put(shopUrl(store.key, '/account/password'), {
            preserveScroll: true,
            onSuccess: () => password.reset(),
        });
    }

    return (
        <StorefrontLayout store={store} title="اطلاعات کاربری">
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <AccountNav store={store} active="profile" />

                <div className="space-y-6">
                    <form
                        onSubmit={saveProfile}
                        className="space-y-4 rounded-xl border bg-white p-5"
                    >
                        <h2 className="text-sm font-semibold">
                            اطلاعات کاربری
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="نام" error={profile.errors.name}>
                                <input
                                    className={inputClass}
                                    value={profile.data.name}
                                    onChange={(e) =>
                                        profile.setData('name', e.target.value)
                                    }
                                />
                            </Field>
                            <Field label="شماره موبایل">
                                <input
                                    className={inputClass}
                                    dir="ltr"
                                    value={customer.phone ?? ''}
                                    disabled
                                />
                            </Field>
                            <Field label="ایمیل" error={profile.errors.email}>
                                <input
                                    className={inputClass}
                                    dir="ltr"
                                    value={profile.data.email}
                                    onChange={(e) =>
                                        profile.setData('email', e.target.value)
                                    }
                                />
                            </Field>
                            <Field label="استان">
                                <input
                                    className={inputClass}
                                    value={profile.data.province}
                                    onChange={(e) =>
                                        profile.setData(
                                            'province',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="شهر">
                                <input
                                    className={inputClass}
                                    value={profile.data.city}
                                    onChange={(e) =>
                                        profile.setData('city', e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                        <Field label="آدرس">
                            <textarea
                                className={inputClass}
                                rows={2}
                                value={profile.data.address}
                                onChange={(e) =>
                                    profile.setData('address', e.target.value)
                                }
                            />
                        </Field>
                        <button
                            type="submit"
                            disabled={profile.processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            {profile.processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            ذخیره
                        </button>
                    </form>

                    <form
                        onSubmit={savePassword}
                        className="space-y-4 rounded-xl border bg-white p-5"
                    >
                        <h2 className="text-sm font-semibold">تغییر رمز عبور</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field
                                label="رمز فعلی"
                                error={password.errors.current_password}
                            >
                                <input
                                    type="password"
                                    className={inputClass}
                                    value={password.data.current_password}
                                    onChange={(e) =>
                                        password.setData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="رمز جدید"
                                error={password.errors.password}
                            >
                                <input
                                    type="password"
                                    className={inputClass}
                                    value={password.data.password}
                                    onChange={(e) =>
                                        password.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="تکرار رمز جدید">
                                <input
                                    type="password"
                                    className={inputClass}
                                    value={password.data.password_confirmation}
                                    onChange={(e) =>
                                        password.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>
                        <button
                            type="submit"
                            disabled={password.processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            {password.processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            تغییر رمز
                        </button>
                    </form>
                </div>
            </div>
        </StorefrontLayout>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm">{label}</label>
            {children}
            {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
    );
}
