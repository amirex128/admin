import { PaginationNav } from '@/components/pagination-nav';
import { ProductCard } from '@/components/storefront/product-card';
import { StorefrontLayout } from '@/components/storefront/storefront-layout';
import type { Paginated, Product, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    category: { id: number; name: string };
    products: Paginated<Product>;
};

export default function StorefrontCategory({
    store,
    category,
    products,
}: PageProps) {
    return (
        <StorefrontLayout
            store={store}
            title={category.name}
            description={`محصولات دسته ${category.name} در ${store.name}`}
        >
            <h1 className="mb-5 text-xl font-bold">{category.name}</h1>

            {products.data.length === 0 ? (
                <p className="py-16 text-center text-neutral-500">
                    محصولی در این دسته وجود ندارد.
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard
                                key={product.id}
                                store={store}
                                product={product}
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center">
                        <PaginationNav links={products.links} />
                    </div>
                </>
            )}
        </StorefrontLayout>
    );
}
