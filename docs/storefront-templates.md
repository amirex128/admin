# Storefront Templates

The storefront is the public, SSR + SEO-friendly website rendered for each
seller's store. A store is resolved by its **subdomain** or **custom domain**
(see `config/storefront.php`) and rendered with the **template** the seller
selected in their store settings.

This document explains how the system works and how to build a new template.

## How a storefront request is served

1. A request hits `/shop/{store}/...` (path form, works everywhere) or a
   store host (subdomain/custom domain in production).
2. `App\Http\Controllers\StorefrontController` resolves the `StoreSetting` by
   `subdomain` or `custom_domain` (`resolve()`), 404ing if none matches.
3. The controller renders an Inertia page named
   `storefront/{template}/{page}` via `render()`, always injecting the shared
   `store` prop built by `storeProps()` (identity, contact, social links,
   enabled badges, category menu, and which content pages exist).
4. The React page wraps its content in `StorefrontLayout` (header + footer) and
   sets SEO metadata through `<Head>`.

The selected template comes from `StoreSetting::$template`. Only templates
listed in `config('storefront.templates')` are selectable in the UI.

## Pages a template MUST provide

Each template is a folder under `resources/js/pages/storefront/{key}/` and must
export these page components (matching the controller's `render()` calls):

| File | Route name | Purpose |
|------|------------|---------|
| `home.tsx` | `storefront.home` | Landing page (carousels: special offers, latest products, categories) |
| `product.tsx` | `storefront.product` | Product detail (gallery, variations, attributes, description, add to cart) |
| `category.tsx` | `storefront.category` | Paginated product grid for a category |
| `page.tsx` | `storefront.page` | Rich-text content page (about / buying-guide / return-policy / terms) |
| `faq.tsx` | `storefront.faq` | FAQ list |
| `cart.tsx` | `storefront.cart` | Cart (client-side via `useCart`) |
| `checkout.tsx` | `storefront.checkout` / `.place` | Checkout form → creates an order |
| `order.tsx` | `storefront.order` | Order receipt / status (also payment callback target) |
| `track.tsx` | `storefront.track` / `.lookup` | Order tracking by code + phone |

## Shared building blocks (reuse these)

- `@/components/storefront/storefront-layout` — `StorefrontLayout` (chrome) and
  `shopUrl(key, path)` for building links.
- `@/components/storefront/product-card` — `ProductCard` and `Carousel`.
- `@/lib/storefront-cart` — `useCart(storeKey)` localStorage cart with live
  cross-component sync.
- `@/lib/format` — `formatToman`, etc.
- Types in `@/types`: `StorefrontStore`, `CartItem`, `Product`, `Order`.

## Props each page receives

All pages receive `store: StorefrontStore`. Page-specific props:

- `home`: `specialProducts: Product[]`, `latestProducts: Product[]`
- `product`: `product: Product` (with `variations`, `attributes`, `images`, `video`)
- `category`: `category`, `products: Paginated<Product>`
- `page`: `page: { title, html }`
- `faq`: `faqs: { question, answer }[]`
- `checkout`: `provinces`, `cities`, `paymentMethods`, `shippingMethods`, `cardToCard`
- `order`: `order: Order`, `cardToCard`

## Checkout & payment flow

1. `checkout.tsx` posts cart items (`{ product_id, quantity }`) plus customer &
   shipping/payment fields to `storefront.checkout.place`.
2. `StorefrontController::placeOrder` re-prices items server-side from the
   seller's products, computes shipping via `StoreSettingService`, applies the
   store VAT, and creates the order through `OrderService` (which also creates/
   links a CRM `Customer`).
3. If the method is **online** and the store's own ZarinPal is configured,
   `StorePaymentService` starts a payment on the **seller's** gateway and the
   buyer is redirected there; the `storefront.payment.callback` route verifies
   and marks the order paid. Otherwise the buyer lands on the order page with
   card-to-card / cash-on-delivery instructions.

> Account top-ups for sellers use the platform ZarinPal (env/config); store
> sales use each seller's own gateway from their store settings.

## Steps to add a new template

1. Create `resources/js/pages/storefront/{key}/` with all the page components
   listed above (copy `classic/` as a starting point).
2. Reuse `StorefrontLayout`, `ProductCard`, `useCart`, and the shared types so
   behavior stays consistent; only restyle the markup.
3. Register the template in `config/storefront.php` under `templates` with a
   unique `key`, a Persian `name`, a `description`, and an optional `preview`.
4. Run `npm run build` (or `npm run dev`) so Vite/SSR picks up the new pages.
5. Sellers can now choose the template from **store settings → دامنه و قالب**.

No backend changes are required to add a template — `StorefrontController`
renders `storefront/{template}/{page}` dynamically based on the seller's choice.
