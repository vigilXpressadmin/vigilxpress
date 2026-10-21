insert into public.categories (name, slug) values ('Food','food'), ('Grocery','grocery'), ('Pharmacy','pharmacy'), ('Retail','retail') on conflict (slug) do nothing;
insert into public.financial_settings (key, value) values ('financial_policy', '{"version":"vigilxpress-policy-pending-approval","commissionBps":0,"settlementDelayHours":0,"settlementsEnabled":false}') on conflict (key) do nothing;
