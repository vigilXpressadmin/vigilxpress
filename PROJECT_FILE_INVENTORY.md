# VigilXpress Project File Inventory

- Project root: `c:\Users\Hp\Desktop\vigilxpress 10.12`
- Scan status: **Complete**. The scan verified 109 pre-existing in-scope files and 71 directories. This generated inventory brings the current in-scope file count to 110.
- Excluded directories: `node_modules/` and `.next/` (dependencies and generated Next.js output). `.git/` was not present at the project root. No other named build/cache directories in the exclusion set were present.
- Excluded cache file: `tsconfig.tsbuildinfo` (TypeScript incremental build cache).
- Hidden files: Included where in scope, including `.env.example`, `.env.local`, `.gitignore`, and `.vscode/settings.json`. Environment file contents were not read or reproduced.
- Asset scan: No `public/` directory or local image, icon, or font assets were present in the scanned project.

## Complete Folder Tree

```text
vigilxpress 10.12/
|-- .vscode/
|   `-- settings.json
|-- app/
|   |-- (about)/
|   |   (empty)
|   |-- (admin)/
|   |   `-- admin/
|   |       |-- approvals/
|   |       |   `-- page.tsx
|   |       |-- payments/
|   |       |   `-- page.tsx
|   |       |-- service-areas/
|   |       |   `-- page.tsx
|   |       `-- page.tsx
|   |-- (auth)/
|   |   |-- login/
|   |   |   `-- page.tsx
|   |   `-- register/
|   |       `-- page.tsx
|   |-- (customer)/
|   |   |-- account/
|   |   |   `-- addresses/
|   |   |       `-- page.tsx
|   |   |-- cart/
|   |   |   `-- page.tsx
|   |   |-- checkout/
|   |   |   `-- page.tsx
|   |   |-- orders/
|   |   |   |-- [id]/
|   |   |   |   `-- page.tsx
|   |   |   `-- page.tsx
|   |   `-- stores/
|   |       |-- [slug]/
|   |       |   `-- page.tsx
|   |       `-- page.tsx
|   |-- (merchant)/
|   |   `-- merchant/
|   |       |-- orders/
|   |       |   `-- page.tsx
|   |       |-- products/
|   |       |   `-- page.tsx
|   |       |-- wallet/
|   |       |   `-- page.tsx
|   |       `-- page.tsx
|   |-- (rider)/
|   |   `-- rider/
|   |       |-- jobs/
|   |       |   `-- page.tsx
|   |       `-- page.tsx
|   |-- about/
|   |   `-- page.tsx
|   |-- api/
|   |   `-- health/
|   |       `-- route.ts
|   |-- contact/
|   |   `-- page.tsx
|   |-- cookies/
|   |   `-- page.tsx
|   |-- faq/
|   |   `-- page.tsx
|   |-- how-it-works/
|   |   `-- page.tsx
|   |-- privacy/
|   |   `-- page.tsx
|   |-- privacy.tsx/
|   |   (empty)
|   |-- refunds/
|   |   `-- page.tsx
|   |-- terms/
|   |   `-- page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   |-- not-found.tsx
|   `-- page.tsx
|-- components/
|   |-- customer/
|   |   |-- merchant-card.tsx
|   |   |-- order-status-timeline.tsx
|   |   |-- product-card.tsx
|   |   `-- service-area-picker.tsx
|   |-- layout/
|   |   |-- site-footer.tsx
|   |   `-- site-header.tsx
|   |-- merchant/
|   |   |-- merchant-order-board.tsx
|   |   `-- merchant-wallet-card.tsx
|   |-- payments/
|   |   `-- paystack-checkout-button.tsx
|   |-- rider/
|   |   |-- rider-availability-card.tsx
|   |   `-- rider-delivery-card.tsx
|   |-- ui/
|   |   |-- button.tsx
|   |   |-- card.tsx
|   |   `-- input.tsx
|   |-- Faq.tsx
|   |-- Footer.tsx
|   |-- Journey.tsx
|   |-- LegalPage.tsx
|   |-- Marquee.tsx
|   |-- Navbar.tsx
|   |-- PhoneTracker.tsx
|   `-- Reveal.tsx
|-- lib/
|   |-- auth/
|   |   `-- roles.ts
|   |-- cart/
|   |   `-- use-cart.ts
|   |-- data/
|   |   `-- demo-catalogue.ts
|   |-- orders/
|   |   |-- pricing.mjs
|   |   `-- pricing.ts
|   |-- payments/
|   |   `-- paystack-client.ts
|   |-- shared/
|   |   |-- money.mjs
|   |   `-- money.ts
|   |-- supabase/
|   |   |-- client.ts
|   |   `-- server.ts
|   |-- validation/
|   |   `-- schemas.ts
|   |-- constants.ts
|   |-- site.ts
|   |-- types.ts
|   `-- utils.ts
|-- supabase/
|   |-- functions/
|   |   |-- _shared/
|   |   |   |-- financial.ts
|   |   |   |-- paystack.ts
|   |   |   `-- supabase.ts
|   |   |-- calculate-merchant-allocations/
|   |   |   `-- index.ts
|   |   |-- create-customer-payment/
|   |   |   `-- index.ts
|   |   |-- paystack-webhook/
|   |   |   `-- index.ts
|   |   |-- process-merchant-settlement/
|   |   |   `-- index.ts
|   |   |-- process-refund/
|   |   |   `-- index.ts
|   |   |-- reconcile-pending-payments/
|   |   |   `-- index.ts
|   |   |-- request-merchant-withdrawal/
|   |   |   `-- index.ts
|   |   |-- request-refund/
|   |   |   `-- index.ts
|   |   `-- verify-customer-payment/
|   |       `-- index.ts
|   |-- migrations/
|   |   |-- 0001_extensions.sql
|   |   |-- 0002_core_identity.sql
|   |   |-- 0003_catalogue.sql
|   |   |-- 0004_orders_payments.sql
|   |   |-- 0005_financial_ledger.sql
|   |   |-- 0006_delivery_ops.sql
|   |   |-- 0007_rls.sql
|   |   `-- 0008_seed_reference_data.sql
|   `-- config.toml
|-- tests/
|   |-- pricing.test.mjs
|   `-- repository-security.test.mjs
|-- tools/
|   `-- validate.mjs
|-- types/
|   `-- supabase.ts
|-- .env.example
|-- .env.local
|-- .gitignore
|-- eslint.config.mjs
|-- middleware.ts
|-- next.config.mjs
|-- next-env.d.ts
|-- package.json
|-- package-lock.json
|-- postcss.config.mjs
|-- PROJECT_FILE_INVENTORY.md
|-- PROJECT_STATUS.md
|-- README.md
|-- tailwind.config.ts
`-- tsconfig.json
```

## Files by Folder

Paths in each folder are sorted and were confirmed present at scan time. For `.env.local`, only the filename is documented; its contents are intentionally omitted.

### Project root

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 1 | `.env.example` | `.env.example` | Environment template | Lists environment configuration keys needed by the app and services; no live values are included here. |
| 2 | `.env.local` | `.env.local` | Local environment file | Local runtime configuration. Contents were not inspected or included because they may contain credentials. |
| 3 | `.gitignore` | `.gitignore` | Git ignore config | Excludes local, generated, or sensitive files from Git. |
| 4 | `eslint.config.mjs` | `eslint.config.mjs` | JavaScript ESM config | ESLint flat configuration for the project. |
| 5 | `middleware.ts` | `middleware.ts` | TypeScript / Next middleware | Refreshes Supabase auth state and redirects unauthenticated requests to protected dashboard paths. |
| 6 | `next.config.mjs` | `next.config.mjs` | JavaScript ESM config | Next.js framework configuration. |
| 7 | `next-env.d.ts` | `next-env.d.ts` | TypeScript declarations | Next.js-generated framework type declarations. |
| 8 | `package.json` | `package.json` | JSON manifest | Project scripts, dependencies, package metadata, and Node engine requirement. |
| 9 | `package-lock.json` | `package-lock.json` | npm lockfile | Locks exact dependency versions for reproducible npm installation. |
| 10 | `postcss.config.mjs` | `postcss.config.mjs` | JavaScript ESM config | PostCSS plugin configuration used by Tailwind CSS. |
| 11 | `PROJECT_STATUS.md` | `PROJECT_STATUS.md` | Markdown | Implementation status, limitations, and required service configuration. |
| 12 | `README.md` | `README.md` | Markdown | Project overview, setup, architecture, security/payment notes, and useful commands. |
| 13 | `tailwind.config.ts` | `tailwind.config.ts` | TypeScript config | Tailwind v3 content scanning, design tokens, font family, and max-width extensions. |
| 14 | `tsconfig.json` | `tsconfig.json` | JSON config | TypeScript compiler options, strictness, module resolution, and `@/*` alias. |

### `.vscode/`

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 15 | `settings.json` | `.vscode/settings.json` | JSON editor config | Workspace CSS lint setting to ignore unknown at-rules such as Tailwind's `@apply`. |

### `app/`

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 16 | `page.tsx` | `app/(admin)/admin/page.tsx` | TypeScript React page | Admin operations dashboard landing page. |
| 17 | `page.tsx` | `app/(admin)/admin/approvals/page.tsx` | TypeScript React page | Merchant/rider approval screen. |
| 18 | `page.tsx` | `app/(admin)/admin/payments/page.tsx` | TypeScript React page | Payment and reconciliation operations screen. |
| 19 | `page.tsx` | `app/(admin)/admin/service-areas/page.tsx` | TypeScript React page | Service-area and delivery-zone administration screen. |
| 20 | `page.tsx` | `app/(auth)/login/page.tsx` | TypeScript React page | Customer login form. |
| 21 | `page.tsx` | `app/(auth)/register/page.tsx` | TypeScript React page | Account registration form. |
| 22 | `page.tsx` | `app/(customer)/account/addresses/page.tsx` | TypeScript React page | Saved customer address screen. |
| 23 | `page.tsx` | `app/(customer)/cart/page.tsx` | TypeScript React page | Customer cart view and item management. |
| 24 | `page.tsx` | `app/(customer)/checkout/page.tsx` | TypeScript React page | Checkout flow, address/total display, and Paystack payment initiation UI. |
| 25 | `page.tsx` | `app/(customer)/orders/page.tsx` | TypeScript React page | Customer order-history route. |
| 26 | `page.tsx` | `app/(customer)/orders/[id]/page.tsx` | TypeScript React page | Dynamic customer order detail and status timeline route. |
| 27 | `page.tsx` | `app/(customer)/stores/page.tsx` | TypeScript React page | Marketplace listing of approved demo merchants. |
| 28 | `page.tsx` | `app/(customer)/stores/[slug]/page.tsx` | TypeScript React page | Dynamic merchant storefront and product listing. |
| 29 | `page.tsx` | `app/(merchant)/merchant/page.tsx` | TypeScript React page | Merchant dashboard landing page and order board. |
| 30 | `page.tsx` | `app/(merchant)/merchant/orders/page.tsx` | TypeScript React page | Merchant incoming-order operations screen. |
| 31 | `page.tsx` | `app/(merchant)/merchant/products/page.tsx` | TypeScript React page | Merchant catalogue management screen. |
| 32 | `page.tsx` | `app/(merchant)/merchant/wallet/page.tsx` | TypeScript React page | Merchant wallet/ledger summary screen. |
| 33 | `page.tsx` | `app/(rider)/rider/page.tsx` | TypeScript React page | Rider dashboard and availability control. |
| 34 | `page.tsx` | `app/(rider)/rider/jobs/page.tsx` | TypeScript React page | Rider delivery-jobs screen. |
| 35 | `page.tsx` | `app/about/page.tsx` | TypeScript React page | Public About marketing page. |
| 36 | `route.ts` | `app/api/health/route.ts` | TypeScript API route | Health endpoint returning service status and a timestamp. |
| 37 | `page.tsx` | `app/contact/page.tsx` | TypeScript React page | Public contact options and contact information. |
| 38 | `page.tsx` | `app/cookies/page.tsx` | TypeScript React page | Cookies policy page. |
| 39 | `page.tsx` | `app/faq/page.tsx` | TypeScript React page | Public FAQ page using the accordion component. |
| 40 | `globals.css` | `app/globals.css` | CSS / Tailwind v3 | Global typography, Tailwind component styles, responsive rules, and custom page classes. |
| 41 | `page.tsx` | `app/how-it-works/page.tsx` | TypeScript React page | Public delivery-process explainer page. |
| 42 | `layout.tsx` | `app/layout.tsx` | TypeScript React layout | Root metadata, fonts, JSON-LD, shared Navbar/Footer, and global CSS import. |
| 43 | `not-found.tsx` | `app/not-found.tsx` | TypeScript React page | Shared not-found/404 page. |
| 44 | `page.tsx` | `app/page.tsx` | TypeScript React page | Public homepage with marketplace messaging, tracker, journey, and FAQ sections. |
| 45 | `page.tsx` | `app/privacy/page.tsx` | TypeScript React page | Privacy policy page. |
| 46 | `page.tsx` | `app/refunds/page.tsx` | TypeScript React page | Refunds policy page. |
| 47 | `page.tsx` | `app/terms/page.tsx` | TypeScript React page | Terms of service page. |

### `components/`

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 48 | `merchant-card.tsx` | `components/customer/merchant-card.tsx` | TypeScript React component | Marketplace card linking to a merchant storefront. |
| 49 | `order-status-timeline.tsx` | `components/customer/order-status-timeline.tsx` | TypeScript React component | Displays order progress across defined order states. |
| 50 | `product-card.tsx` | `components/customer/product-card.tsx` | TypeScript React component | Product display card with add-to-cart behavior. |
| 51 | `service-area-picker.tsx` | `components/customer/service-area-picker.tsx` | TypeScript React component | Customer city/area selection UI. |
| 52 | `Faq.tsx` | `components/Faq.tsx` | TypeScript React component | Client-side FAQ accordion. |
| 53 | `Footer.tsx` | `components/Footer.tsx` | TypeScript React component | Shared marketing footer using site constants and contact/social links. |
| 54 | `Journey.tsx` | `components/Journey.tsx` | TypeScript React component | Animated, scroll-linked order journey section for the homepage. |
| 55 | `site-footer.tsx` | `components/layout/site-footer.tsx` | TypeScript React component | Alternate platform footer with Platform, Partners, and Legal sections. |
| 56 | `site-header.tsx` | `components/layout/site-header.tsx` | TypeScript React component | Alternate platform header/navigation for marketplace and account routes. |
| 57 | `merchant-order-board.tsx` | `components/merchant/merchant-order-board.tsx` | TypeScript React component | Merchant order cards with accept/reject/ready action controls. |
| 58 | `merchant-wallet-card.tsx` | `components/merchant/merchant-wallet-card.tsx` | TypeScript React component | Displays merchant available, pending, and lifetime ledger totals. |
| 59 | `LegalPage.tsx` | `components/LegalPage.tsx` | TypeScript React component | Shared legal-page header, introduction, content wrapper, and updated date. |
| 60 | `Marquee.tsx` | `components/Marquee.tsx` | TypeScript React component | Repeating brand/marketing text strip for the homepage. |
| 61 | `Navbar.tsx` | `components/Navbar.tsx` | TypeScript React component | Shared fixed marketing navbar with responsive route links and order CTA. |
| 62 | `paystack-checkout-button.tsx` | `components/payments/paystack-checkout-button.tsx` | TypeScript React component | Initializes a customer payment and opens the Paystack inline checkout. |
| 63 | `PhoneTracker.tsx` | `components/PhoneTracker.tsx` | TypeScript React component | Homepage order-tracking phone/card visual. |
| 64 | `rider-availability-card.tsx` | `components/rider/rider-availability-card.tsx` | TypeScript React component | Rider availability toggle card. |
| 65 | `rider-delivery-card.tsx` | `components/rider/rider-delivery-card.tsx` | TypeScript React component | Rider job status and delivery action card. |
| 66 | `Reveal.tsx` | `components/Reveal.tsx` | TypeScript React component | IntersectionObserver reveal-on-scroll wrapper. |
| 67 | `button.tsx` | `components/ui/button.tsx` | TypeScript React component | Button primitive styled with shared button classes. |
| 68 | `card.tsx` | `components/ui/card.tsx` | TypeScript React component | Card primitive styled with shared card classes. |
| 69 | `input.tsx` | `components/ui/input.tsx` | TypeScript React component | Input primitive styled with shared input classes. |

### `lib/`

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 70 | `roles.ts` | `lib/auth/roles.ts` | TypeScript module | Role membership and dashboard-access helper functions. |
| 71 | `use-cart.ts` | `lib/cart/use-cart.ts` | TypeScript React hook | Persists cart items in local storage and provides cart mutation/grouping helpers. |
| 72 | `constants.ts` | `lib/constants.ts` | TypeScript module | Brand constant, allowed order-state values, and settlement feature flag. |
| 73 | `demo-catalogue.ts` | `lib/data/demo-catalogue.ts` | TypeScript module | Demo merchant/product data and catalogue query helpers. |
| 74 | `pricing.mjs` | `lib/orders/pricing.mjs` | JavaScript ESM module | Calculates authoritative order quotes and validates state transitions. |
| 75 | `pricing.ts` | `lib/orders/pricing.ts` | TypeScript module | TypeScript-facing wrapper/re-export of the pricing runtime module. |
| 76 | `paystack-client.ts` | `lib/payments/paystack-client.ts` | TypeScript client module | Loads Paystack InlineJS and opens the client-side payment popup. |
| 77 | `money.mjs` | `lib/shared/money.mjs` | JavaScript ESM module | Integer-kobo arithmetic, merchant allocation, and NGN currency formatting helpers. |
| 78 | `money.ts` | `lib/shared/money.ts` | TypeScript module | TypeScript-facing wrapper/re-export of the money runtime module. |
| 79 | `client.ts` | `lib/supabase/client.ts` | TypeScript module | Creates the browser Supabase client. |
| 80 | `server.ts` | `lib/supabase/server.ts` | TypeScript module | Creates a server-side Supabase client using Next.js request cookies. |
| 81 | `schemas.ts` | `lib/validation/schemas.ts` | TypeScript module | Zod schemas for checkout items, addresses, and payment initialization. |
| 82 | `site.ts` | `lib/site.ts` | TypeScript module | Shared brand/contact/social constants and WhatsApp-link builder. |
| 83 | `types.ts` | `lib/types.ts` | TypeScript declarations | App role, merchant/product, cart, and order-state types. |
| 84 | `utils.ts` | `lib/utils.ts` | TypeScript module | `clsx` class-name helper and required-environment-value guard. |

### `supabase/`

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 85 | `config.toml` | `supabase/config.toml` | TOML config | Supabase local project, API, database, Studio, Auth, and Edge Runtime configuration. |
| 86 | `financial.ts` | `supabase/functions/_shared/financial.ts` | TypeScript Edge Function helper | Allocates verified payments to merchant/platform ledger accounts idempotently. |
| 87 | `paystack.ts` | `supabase/functions/_shared/paystack.ts` | TypeScript Edge Function helper | Paystack initialize/verify API calls and webhook HMAC signature verification. |
| 88 | `supabase.ts` | `supabase/functions/_shared/supabase.ts` | TypeScript Edge Function helper | Supabase admin client, auth-header user lookup, and JSON response helper. |
| 89 | `index.ts` | `supabase/functions/calculate-merchant-allocations/index.ts` | TypeScript Edge Function | Authenticated endpoint to create ledger allocations for a payment. |
| 90 | `index.ts` | `supabase/functions/create-customer-payment/index.ts` | TypeScript Edge Function | Authenticates a customer, initializes Paystack payment for an order group, and stores payment details. |
| 91 | `index.ts` | `supabase/functions/paystack-webhook/index.ts` | TypeScript Edge Function | Validates Paystack webhook signatures/events and updates verified payments and allocations. |
| 92 | `index.ts` | `supabase/functions/process-merchant-settlement/index.ts` | TypeScript Edge Function | Settlement endpoint scaffold; refuses processing unless approved capability/configuration is enabled. |
| 93 | `index.ts` | `supabase/functions/process-refund/index.ts` | TypeScript Edge Function | Refund processing scaffold; currently returns a disabled response pending policy/provider approval. |
| 94 | `index.ts` | `supabase/functions/reconcile-pending-payments/index.ts` | TypeScript Edge Function | Checks old pending/initialized payments with Paystack verification. |
| 95 | `index.ts` | `supabase/functions/request-merchant-withdrawal/index.ts` | TypeScript Edge Function | Withdrawal endpoint scaffold; currently disabled pending required approvals and controls. |
| 96 | `index.ts` | `supabase/functions/request-refund/index.ts` | TypeScript Edge Function | Authenticated customer refund request creation with ownership and idempotency checks. |
| 97 | `index.ts` | `supabase/functions/verify-customer-payment/index.ts` | TypeScript Edge Function | Verifies a customer payment against Paystack and updates payment/order ledger state. |
| 98 | `0001_extensions.sql` | `supabase/migrations/0001_extensions.sql` | SQL migration | Enables database extensions and defines the shared updated-at trigger function. |
| 99 | `0002_core_identity.sql` | `supabase/migrations/0002_core_identity.sql` | SQL migration | Creates core profiles, roles, service areas/zones, customer addresses, merchants, stores, and riders. |
| 100 | `0003_catalogue.sql` | `supabase/migrations/0003_catalogue.sql` | SQL migration | Creates product categories, products, variants, and related catalogue indexes/triggers. |
| 101 | `0004_orders_payments.sql` | `supabase/migrations/0004_orders_payments.sql` | SQL migration | Creates order groups, merchant orders/items/events, payments, and payment events. |
| 102 | `0005_financial_ledger.sql` | `supabase/migrations/0005_financial_ledger.sql` | SQL migration | Creates financial settings, ledger accounts/entries, settlements, and refunds. |
| 103 | `0006_delivery_ops.sql` | `supabase/migrations/0006_delivery_ops.sql` | SQL migration | Creates delivery jobs/stops/assignments/proofs, support tickets, audit logs, and notification outbox. |
| 104 | `0007_rls.sql` | `supabase/migrations/0007_rls.sql` | SQL migration | Enables row-level security on application tables. |
| 105 | `0008_seed_reference_data.sql` | `supabase/migrations/0008_seed_reference_data.sql` | SQL migration | Seeds catalogue categories and a disabled/pending-approval financial policy. |

### `tests/`, `tools/`, and `types/`

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 106 | `pricing.test.mjs` | `tests/pricing.test.mjs` | JavaScript ESM test | Tests integer-kobo calculations, quotes, merchant allocations, formatting, and order transitions. |
| 107 | `repository-security.test.mjs` | `tests/repository-security.test.mjs` | JavaScript ESM test | Checks schema financial invariants, RLS migration coverage, and obvious committed-secret patterns. |
| 108 | `validate.mjs` | `tools/validate.mjs` | JavaScript ESM script | Checks required project files, scans for selected secret patterns, and validates migration invariants. |
| 109 | `supabase.ts` | `types/supabase.ts` | TypeScript declarations | Handwritten Supabase data-model interfaces for profiles, merchants, stores, products, orders, and payments. |

## Similar Names And Usage Notes

- `lib/orders/pricing.mjs` and `lib/orders/pricing.ts`, and `lib/shared/money.mjs` and `lib/shared/money.ts`, are similarly named by design. The `.ts` modules import/re-export their `.mjs` counterparts; tests and app code reference the runtime modules. They are not duplicate copies based on the references inspected.
- `components/Navbar.tsx` and `components/Footer.tsx` are imported by `app/layout.tsx`. `components/layout/site-header.tsx` and `components/layout/site-footer.tsx` define an alternate header/footer, but a project-wide reference search found no imports of those exports. They appear unused in the current app route tree; this is a static-reference observation, not a deletion recommendation.
- `app/(about)/` and `app/privacy.tsx/` are empty legacy directories. They contain no files and therefore do not add routes in the current App Router tree.
- The project contains no local asset directory. In particular, no image, icon, or font files were found in the in-scope filesystem scan.

## Generated Inventory File

| No. | File Name | Exact Relative Path | File Type | Purpose |
|---:|---|---|---|---|
| 110 | `PROJECT_FILE_INVENTORY.md` | `PROJECT_FILE_INVENTORY.md` | Markdown | This complete, filesystem-verified project file inventory. |

## Copyable Exact File Paths

```text
.env.example
.env.local
.gitignore
.vscode/settings.json
app/(admin)/admin/approvals/page.tsx
app/(admin)/admin/page.tsx
app/(admin)/admin/payments/page.tsx
app/(admin)/admin/service-areas/page.tsx
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/(customer)/account/addresses/page.tsx
app/(customer)/cart/page.tsx
app/(customer)/checkout/page.tsx
app/(customer)/orders/[id]/page.tsx
app/(customer)/orders/page.tsx
app/(customer)/stores/[slug]/page.tsx
app/(customer)/stores/page.tsx
app/(merchant)/merchant/orders/page.tsx
app/(merchant)/merchant/page.tsx
app/(merchant)/merchant/products/page.tsx
app/(merchant)/merchant/wallet/page.tsx
app/(rider)/rider/jobs/page.tsx
app/(rider)/rider/page.tsx
app/about/page.tsx
app/api/health/route.ts
app/contact/page.tsx
app/cookies/page.tsx
app/faq/page.tsx
app/globals.css
app/how-it-works/page.tsx
app/layout.tsx
app/not-found.tsx
app/page.tsx
app/privacy/page.tsx
app/refunds/page.tsx
app/terms/page.tsx
components/Faq.tsx
components/Footer.tsx
components/Journey.tsx
components/LegalPage.tsx
components/Marquee.tsx
components/Navbar.tsx
components/PhoneTracker.tsx
components/Reveal.tsx
components/customer/merchant-card.tsx
components/customer/order-status-timeline.tsx
components/customer/product-card.tsx
components/customer/service-area-picker.tsx
components/layout/site-footer.tsx
components/layout/site-header.tsx
components/merchant/merchant-order-board.tsx
components/merchant/merchant-wallet-card.tsx
components/payments/paystack-checkout-button.tsx
components/rider/rider-availability-card.tsx
components/rider/rider-delivery-card.tsx
components/ui/button.tsx
components/ui/card.tsx
components/ui/input.tsx
eslint.config.mjs
lib/auth/roles.ts
lib/cart/use-cart.ts
lib/constants.ts
lib/data/demo-catalogue.ts
lib/orders/pricing.mjs
lib/orders/pricing.ts
lib/payments/paystack-client.ts
lib/shared/money.mjs
lib/shared/money.ts
lib/site.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/types.ts
lib/utils.ts
lib/validation/schemas.ts
middleware.ts
next-env.d.ts
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
PROJECT_FILE_INVENTORY.md
PROJECT_STATUS.md
README.md
supabase/config.toml
supabase/functions/_shared/financial.ts
supabase/functions/_shared/paystack.ts
supabase/functions/_shared/supabase.ts
supabase/functions/calculate-merchant-allocations/index.ts
supabase/functions/create-customer-payment/index.ts
supabase/functions/paystack-webhook/index.ts
supabase/functions/process-merchant-settlement/index.ts
supabase/functions/process-refund/index.ts
supabase/functions/reconcile-pending-payments/index.ts
supabase/functions/request-merchant-withdrawal/index.ts
supabase/functions/request-refund/index.ts
supabase/functions/verify-customer-payment/index.ts
supabase/migrations/0001_extensions.sql
supabase/migrations/0002_core_identity.sql
supabase/migrations/0003_catalogue.sql
supabase/migrations/0004_orders_payments.sql
supabase/migrations/0005_financial_ledger.sql
supabase/migrations/0006_delivery_ops.sql
supabase/migrations/0007_rls.sql
supabase/migrations/0008_seed_reference_data.sql
tailwind.config.ts
tests/pricing.test.mjs
tests/repository-security.test.mjs
tools/validate.mjs
tsconfig.json
types/supabase.ts
```
