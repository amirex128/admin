import { Link } from '@inertiajs/react';
import { ChevronLeft, Sparkles } from 'lucide-react';

import {
    Carousel,
    ProductCard,
} from '@/components/storefront/product-card';
import {
    StorefrontLayout,
    shopUrl,
} from '@/components/storefront/storefront-layout';
import type { Product, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    specialProducts: Product[];
    latestProducts: Product[];
};

export default function StorefrontHome({
    store,
    specialProducts,
    latestProducts,
}: PageProps) {
    return (
        <StorefrontLayout
            store={store}
            description={`${store.name} - ${store.business_type ?? 'فروشگاه اینترنتی'}`}
        >
            <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-l from-primary/10 to-primary/5 p-8 text-center">
                <h1 className="text-2xl font-bold sm:text-3xl">{store.name}</h1>
                {store.business_type && (
                    <p className="mt-2 text-neutral-600">
                        {store.business_type}
                    </p>
                )}
            </section>

            {store.categories.length > 0 && (
                <Section title="دسته‌بندی‌ها">
                    <Carousel>
                        {store.categories.map((category) => (
                            <Link
                                key={category.id}
                                href={shopUrl(
                                    store.key,
                                    `/categories/${category.id}`,
                                )}
                                className="flex w-32 shrink-0 items-center justify-center rounded-xl border bg-white px-4 py-6 text-center text-sm font-medium hover:border-primary hover:text-primary"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </Carousel>
                </Section>
            )}

            {specialProducts.length > 0 && (
                <Section
                    title="پیشنهادهای ویژه"
                    icon={<Sparkles className="size-5 text-amber-500" />}
                >
                    <Carousel>
                        {specialProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                store={store}
                                product={product}
                            />
                        ))}
                    </Carousel>
                </Section>
            )}

            <Section title="جدیدترین محصولات">
                {latestProducts.length === 0 ? (
                    <p className="py-10 text-center text-neutral-500">
                        هنوز محصولی اضافه نشده است.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {latestProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                store={store}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </Section>
        </StorefrontLayout>
    );
}

function Section({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-8">
            <div className="mb-3 flex items-center gap-2">
                {icon}
                <h2 className="text-lg font-bold">{title}</h2>
                <ChevronLeft className="size-4 text-neutral-400" />
            </div>
            {children}
        </section>
    );
}
