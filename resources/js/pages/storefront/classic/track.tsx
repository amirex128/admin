import { useForm } from '@inertiajs/react';
import { Loader2, Search } from 'lucide-react';

import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import type { StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
};

export default function StorefrontTrack({ store }: PageProps) {
    const form = useForm({ code: '', phone: '' });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(shopUrl(store.key, '/track'));
    }

    const inputClass =
        'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none';

    return (
        <StorefrontLayout store={store} title="پیگیری سفارش">
            <div className="mx-auto max-w-md">
                <h1 className="mb-5 text-xl font-bold">پیگیری سفارش</h1>

                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-2xl border bg-white p-5"
                >
                    <div className="space-y-1.5">
                        <label className="text-sm">کد سفارش</label>
                        <input
                            className={inputClass}
                            dir="ltr"
                            value={form.data.code}
                            onChange={(e) =>
                                form.setData('code', e.target.value)
                            }
                        />
                        {form.errors.code && (
                            <p className="text-xs text-rose-600">
                                {form.errors.code}
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
                    </div>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-primary-foreground hover:opacity-90"
                    >
                        {form.processing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Search className="size-4" />
                        )}
                        پیگیری
                    </button>
                </form>
            </div>
        </StorefrontLayout>
    );
}
