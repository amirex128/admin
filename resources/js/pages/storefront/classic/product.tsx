import { ImageOff, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { StorefrontLayout } from '@/components/storefront/storefront-layout';
import { formatToman } from '@/lib/format';
import { useCart } from '@/lib/storefront-cart';
import type { Product, StorefrontStore } from '@/types';

type PageProps = {
    store: StorefrontStore;
    product: Product;
};

export default function StorefrontProduct({ store, product }: PageProps) {
    const { add } = useCart(store.key);
    const variations = product.variations ?? [];
    const [active, setActive] = useState<Product>(product);
    const [quantity, setQuantity] = useState(1);

    const gallery = active.images?.length ? active.images : product.images;
    const [mainImage, setMainImage] = useState<string | null>(
        gallery?.[0]?.url ?? null,
    );

    function selectVariation(variation: Product) {
        setActive(variation);
        setMainImage(
            (variation.images?.length
                ? variation.images
                : product.images)?.[0]?.url ?? null,
        );
    }

    function addToCart() {
        add({
            product_id: active.id,
            name:
                active.id === product.id
                    ? product.name
                    : `${product.name} (${Object.values(
                          active.variation_attributes ?? {},
                      ).join(' / ')})`,
            price: active.discounted_price,
            quantity,
            image: mainImage,
        });
        toast.success('به سبد خرید اضافه شد.');
    }

    const hasDiscount =
        active.discount_percent != null && active.discount_percent > 0;

    return (
        <StorefrontLayout
            store={store}
            title={product.name}
            description={
                product.description?.replace(/<[^>]*>/g, '').slice(0, 150) ??
                product.name
            }
        >
            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <div className="aspect-square overflow-hidden rounded-2xl border bg-neutral-100">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center text-neutral-400">
                                <ImageOff className="size-12" />
                            </div>
                        )}
                    </div>
                    {gallery && gallery.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                            {gallery.map((media) => (
                                <button
                                    key={media.id}
                                    type="button"
                                    onClick={() => setMainImage(media.url)}
                                    className={`size-16 shrink-0 overflow-hidden rounded-lg border ${
                                        mainImage === media.url
                                            ? 'border-primary'
                                            : ''
                                    }`}
                                >
                                    <img
                                        src={media.url}
                                        alt=""
                                        className="size-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                    {product.video?.url && (
                        <video
                            src={product.video.url}
                            controls
                            className="mt-3 w-full rounded-xl border"
                        />
                    )}
                </div>

                <div className="space-y-5">
                    <h1 className="text-2xl font-bold">{product.name}</h1>

                    <div className="flex items-end gap-3">
                        {hasDiscount && (
                            <span className="text-neutral-400 line-through">
                                {formatToman(active.price)}
                            </span>
                        )}
                        <span className="text-2xl font-bold text-primary">
                            {formatToman(active.discounted_price)} تومان
                        </span>
                        {hasDiscount && (
                            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-sm text-rose-600">
                                {active.discount_percent}٪ تخفیف
                            </span>
                        )}
                    </div>

                    {variations.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-medium">تنوع‌ها</span>
                            <div className="flex flex-wrap gap-2">
                                {variations.map((variation) => (
                                    <button
                                        key={variation.id}
                                        type="button"
                                        onClick={() =>
                                            selectVariation(variation)
                                        }
                                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                                            active.id === variation.id
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : ''
                                        }`}
                                    >
                                        {Object.values(
                                            variation.variation_attributes ?? {},
                                        ).join(' / ') || `تنوع ${variation.id}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.attributes && product.attributes.length > 0 && (
                        <div className="rounded-xl border">
                            <div className="border-b bg-neutral-50 px-3 py-2 text-sm font-medium">
                                مشخصات
                            </div>
                            <dl className="divide-y text-sm">
                                {product.attributes.map((attribute) => (
                                    <div
                                        key={attribute.id}
                                        className="flex justify-between px-3 py-2"
                                    >
                                        <dt className="text-neutral-500">
                                            {attribute.name}
                                        </dt>
                                        <dd>
                                            {attribute.values
                                                .map((v) => v.value)
                                                .join('، ')}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                className="p-2"
                            >
                                <Minus className="size-4" />
                            </button>
                            <span className="w-10 text-center tabular-nums">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                className="p-2"
                            >
                                <Plus className="size-4" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={addToCart}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-primary-foreground hover:opacity-90"
                        >
                            <ShoppingCart className="size-5" />
                            افزودن به سبد خرید
                        </button>
                    </div>
                </div>
            </div>

            {product.description && (
                <section className="mt-10">
                    <h2 className="mb-3 text-lg font-bold">توضیحات محصول</h2>
                    <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: product.description,
                        }}
                    />
                </section>
            )}
        </StorefrontLayout>
    );
}
