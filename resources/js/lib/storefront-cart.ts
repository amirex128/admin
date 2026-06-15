import { useCallback, useEffect, useState } from 'react';

import type { CartItem } from '@/types';

/**
 * A simple per-store shopping cart persisted in localStorage. Kept client-side
 * so storefront browsing pages stay cacheable/SSR-friendly.
 */
export function useCart(storeKey: string) {
    const storageKey = `storefront-cart:${storeKey}`;
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const read = () => {
            try {
                const raw = window.localStorage.getItem(storageKey);
                setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
            } catch {
                setItems([]);
            }
        };

        read();
        window.addEventListener('storefront-cart-changed', read);
        window.addEventListener('storage', read);

        return () => {
            window.removeEventListener('storefront-cart-changed', read);
            window.removeEventListener('storage', read);
        };
    }, [storageKey]);

    const persist = useCallback(
        (next: CartItem[]) => {
            setItems(next);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(storageKey, JSON.stringify(next));
                window.dispatchEvent(new CustomEvent('storefront-cart-changed'));
            }
        },
        [storageKey],
    );

    const add = useCallback(
        (item: CartItem) => {
            const existing = items.find(
                (i) => i.product_id === item.product_id,
            );
            const next = existing
                ? items.map((i) =>
                      i.product_id === item.product_id
                          ? { ...i, quantity: i.quantity + item.quantity }
                          : i,
                  )
                : [...items, item];
            persist(next);
        },
        [items, persist],
    );

    const setQuantity = useCallback(
        (productId: number, quantity: number) => {
            persist(
                items
                    .map((i) =>
                        i.product_id === productId
                            ? { ...i, quantity: Math.max(1, quantity) }
                            : i,
                    )
                    .filter((i) => i.quantity > 0),
            );
        },
        [items, persist],
    );

    const remove = useCallback(
        (productId: number) => {
            persist(items.filter((i) => i.product_id !== productId));
        },
        [items, persist],
    );

    const clear = useCallback(() => persist([]), [persist]);

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return { items, add, setQuantity, remove, clear, count, total };
}
