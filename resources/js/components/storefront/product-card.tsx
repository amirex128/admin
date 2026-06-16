import { Link } from '@inertiajs/react';
import { ImageOff, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { shopUrl } from '@/components/storefront/storefront-layout';
import { formatToman } from '@/lib/format';
import { useCart } from '@/lib/storefront-cart';
import type { Product, StorefrontStore } from '@/types';

export function ProductCard({
    store,
    product,
}: {
    store: StorefrontStore;
    product: Product;
}) {
    const { add } = useCart(store.key);
    const image = product.images?.[0]?.url ?? null;
    const hasDiscount =
        product.discount_percent != null && product.discount_percent > 0;

    function addToCart() {
        add({
            product_id: product.id,
            name: product.name,
            price: product.discounted_price,
            quantity: 1,
            image,
        });
        toast.success('به سبد خرید اضافه شد.');
    }

    return (
        <div className="flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border bg-white sm:w-auto sm:shrink">
            <Link
                href={shopUrl(store.key, `/products/${product.id}`)}
                className="block aspect-square bg-neutral-100"
            >
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="size-full object-cover"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-neutral-400">
                        <ImageOff className="size-8" />
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-3">
                <Link
                    href={shopUrl(store.key, `/products/${product.id}`)}
                    className="line-clamp-2 text-sm font-medium hover:text-primary"
                >
                    {product.name}
                </Link>
                <div className="mt-auto">
                    {hasDiscount && (
                        <span className="block text-xs text-neutral-400 line-through">
                            {formatToman(product.price)}
                        </span>
                    )}
                    <span className="text-sm font-bold text-primary">
                        {formatToman(product.discounted_price)} تومان
                    </span>
                </div>
                <button
                    type="button"
                    onClick={addToCart}
                    className="inline-flex items-center justify-center gap-1 rounded-md bg-primary py-1.5 text-xs text-primary-foreground hover:opacity-90"
                >
                    <Plus className="size-3.5" />
                    افزودن به سبد
                </button>
            </div>
        </div>
    );
}

export function Carousel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {children}
        </div>
    );
}
