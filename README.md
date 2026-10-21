# VIGILXpress

Production-oriented multi-merchant marketplace and delivery platform built with Next.js App Router, TypeScript, Tailwind CSS, Supabase and Paystack.

## Status

This repository is a complete implementation scaffold with real application modules, database migrations, Row Level Security policies, Supabase Edge Functions for payment initiation/verification/webhooks/accounting, customer/merchant/rider/admin interfaces, tests and validation tooling. It intentionally contains **no real credentials** and does **not** simulate unsupported settlement.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run validate
npm run dev
```

Required services:

1. Create a Supabase project.
2. Run migrations in `supabase/migrations` in order.
3. Configure Supabase Auth email provider and, optionally, phone OTP.
4. Set Edge Function secrets listed in `.env.example` / `supabase/config.toml` notes.
5. Configure a Paystack account and webhook URL pointing to the deployed `paystack-webhook` Edge Function.
6. Verify Paystack subaccount/split/transfer capabilities for your account before enabling merchant settlements.

## Important payment rule

The browser callback is never proof of payment. Orders become payable/fulfillable only after server-side Paystack verification and/or a verified signed webhook, using idempotent backend operations.

## Multi-merchant checkout

A customer checkout creates:

- one `order_groups` parent record,
- one `orders` record per merchant,
- immutable `order_items` price snapshots,
- one customer-facing `payments` transaction,
- idempotent `ledger_entries` allocations per merchant after verified payment.

The delivery model supports multiple pickup stops through `delivery_jobs` and `delivery_stops`; it does not assume all merchant orders are always one physical trip.

## Security

- RLS is enabled on application tables.
- Paystack secret and Supabase service-role keys are server-side only.
- Financial entries are immutable and use explicit reversals.
- Merchant wallets are ledger-derived and cannot be edited by merchants.
- Settlement and withdrawals are disabled until approved and provider capability is verified.

## Useful commands

```bash
npm run dev        # local Next.js app
npm run test       # dependency-free critical workflow tests
npm run validate   # repository hygiene/security checks
npm run build      # requires installed dependencies
npm run lint       # requires installed dependencies
```

## Environment

See `.env.example`. Do not commit real secrets.

## Deployment

- Deploy Next.js to Vercel or another Node-compatible platform.
- Deploy Edge Functions with Supabase CLI.
- Set production Paystack keys and webhook secret handling according to current Paystack docs.
- Run `supabase db push` for migrations after review.
