import { StorefrontLayout } from '@/components/storefront/storefront-layout';
import type { StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    page: { title: string; html: string };
};

export default function StorefrontPage({ store, page }: PageProps) {
    return (
        <StorefrontLayout store={store} title={page.title}>
            <article className="mx-auto max-w-3xl rounded-2xl border bg-white p-6">
                <h1 className="mb-4 text-xl font-bold">{page.title}</h1>
                {page.html ? (
                    <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: page.html }}
                    />
                ) : (
                    <p className="text-neutral-500">محتوایی ثبت نشده است.</p>
                )}
            </article>
        </StorefrontLayout>
    );
}
