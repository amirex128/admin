import { StorefrontLayout } from '@/components/storefront/storefront-layout';
import type { StoreFaq, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    faqs: StoreFaq[];
};

export default function StorefrontFaq({ store, faqs }: PageProps) {
    return (
        <StorefrontLayout store={store} title="سوالات متداول">
            <h1 className="mb-5 text-xl font-bold">سوالات متداول</h1>

            <div className="mx-auto max-w-3xl space-y-3">
                {faqs.length === 0 && (
                    <p className="text-neutral-500">سوالی ثبت نشده است.</p>
                )}
                {faqs.map((faq, index) => (
                    <details
                        key={index}
                        className="rounded-xl border bg-white p-4"
                    >
                        <summary className="cursor-pointer font-medium">
                            {faq.question}
                        </summary>
                        <p className="mt-2 text-sm text-neutral-600">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </StorefrontLayout>
    );
}
