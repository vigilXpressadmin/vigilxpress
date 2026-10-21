-- Allow customers to insert and update their own orders and payments during checkout
create policy if not exists order_groups_customer_insert on public.order_groups for insert with check (customer_id = auth.uid() or public.is_admin());
create policy if not exists order_groups_customer_update on public.order_groups for update using (customer_id = auth.uid() or public.is_admin());

create policy if not exists orders_customer_insert on public.orders for insert with check (exists (select 1 from public.order_groups g where g.id = order_group_id and g.customer_id = auth.uid()) or public.is_admin());
create policy if not exists orders_customer_update on public.orders for update using (exists (select 1 from public.order_groups g where g.id = order_group_id and g.customer_id = auth.uid()) or public.is_merchant_owner(merchant_id) or public.is_admin());

create policy if not exists order_items_customer_insert on public.order_items for insert with check (exists (select 1 from public.orders o join public.order_groups g on g.id = o.order_group_id where o.id = order_id and g.customer_id = auth.uid()) or public.is_admin());

create policy if not exists payments_customer_insert on public.payments for insert with check (exists (select 1 from public.order_groups g where g.id = order_group_id and g.customer_id = auth.uid()) or public.is_admin());
create policy if not exists payments_customer_update on public.payments for update using (exists (select 1 from public.order_groups g where g.id = order_group_id and g.customer_id = auth.uid()) or public.is_admin());

create policy if not exists order_events_customer_insert on public.order_events for insert with check (exists (select 1 from public.order_groups g where g.id = order_group_id and g.customer_id = auth.uid()) or public.is_admin());
