# VIGILXpress Project Status

## Implemented in this delivery

- Next.js App Router + TypeScript project structure.
- Tailwind CSS design system using approved neutral/orange direction.
- Public customer homepage, discovery, cart, checkout, orders, account/address pages.
- Merchant dashboard shell with catalogue, incoming orders and wallet views.
- Rider dashboard shell with jobs and delivery confirmation UI.
- Admin dashboard shell with approvals, payments, service-area and exception views.
- Supabase client/server helpers and middleware session refresh.
- Multi-merchant data model: parent order groups, merchant orders, immutable order items, payments, delivery jobs/stops.
- Merchant wallet ledger schema with integer-kobo entries, idempotency keys, reversals and settlement placeholders.
- Paystack secure initialization/verification/webhook Edge Functions with HMAC verification, idempotency and allocation hooks.
- Refund/reversal and reconciliation function scaffolds that are disabled until policy approval.
- RLS migrations for core customer/merchant/rider/admin separation.
- Dependency-free validation and workflow tests.

## Deliberately not implemented or not enabled

- Real bank settlement/withdrawals: blocked pending business-owner approval, Paystack account capability verification and reconciliation controls.
- Production Paystack credentials, live webhook URL and Supabase project binding.
- SMS/WhatsApp/push notification delivery provider.
- Maps/routing provider integration.
- POS/inventory synchronisation.
- Bulk CSV import UI.
- AI-assisted ordering.

## Required configuration before running

1. Supabase project URL, anon key and database migrations.
2. Supabase Auth settings and redirect URLs.
3. Supabase Edge Function secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, optionally `PAYSTACK_WEBHOOK_IP_ALLOWLIST`, `FINANCIAL_POLICY_VERSION`, `PLATFORM_COMMISSION_BPS`, `SETTLEMENT_DELAY_HOURS`.
4. Paystack test keys and webhook endpoint.
5. Approved commission, delivery fee, service fee, refund and settlement policy values.

## Validation performed in this packaging environment

- `npm run validate` passed: required files exist, no obvious secret patterns are committed, migrations include RLS and integer-kobo financial fields.
- `npm test` passed for dependency-free calculation and workflow state tests.

## Not fully validated here

- `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` completed and refreshed `package-lock.json`.
- `npm ci --ignore-scripts --no-audit --no-fund` was attempted but the sandbox network disconnected during dependency extraction (`ENOTCONN`), so `node_modules` is not included. `npm run build` and `npm run lint` could not be executed here; run them after `npm ci` on a machine with reliable registry access and a real Supabase/Paystack project.

## Known limitations

- Some dashboard pages are functional shells with strongly typed components and data-access boundaries, but need live Supabase data to be fully exercised.
- Financial policy values are configurable placeholders only; do not treat them as approved commercial terms.
- Paystack subaccounts/splits/transfers require account-specific verification before enabling automatic disbursement.
