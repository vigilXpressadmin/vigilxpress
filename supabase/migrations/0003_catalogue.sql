create table if not exists public.categories (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, created_at timestamptz not null default now());
create table if not exists public.products (id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id) on delete cascade, category_id uuid references public.categories(id) on delete set null, name text not null, description text not null default '', price_kobo integer not null check (price_kobo >= 0), image_path text, is_available boolean not null default true, is_approved boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.product_variants (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, name text not null, price_delta_kobo integer not null default 0, is_available boolean not null default true, created_at timestamptz not null default now());
create trigger set_updated before update on public.products for each row execute function public.set_updated_at();
create index if not exists products_store_idx on public.products(store_id);
create index if not exists products_name_trgm_idx on public.products using gin (name gin_trgm_ops);
create extension if not exists pg_trgm;
