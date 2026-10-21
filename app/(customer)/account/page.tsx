'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PackageSearch,
  MapPin,
  ShoppingBag,
  Clock,
  ArrowRight,
  ExternalLink,
  User,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable, type Column, StatusBadge } from '@/components/dashboard/data-table';
import { createClient } from '@/lib/supabase/client';
import { useUserSession } from '@/lib/auth/use-user-session';
import { useRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';

interface CustomerOrderSummary {
  id: string;
  store: string;
  total: string;
  status: string;
  date: string;
  [key: string]: unknown;
}

const columns: Column<CustomerOrderSummary>[] = [
  {
    key: 'id',
    header: 'Order ID',
    render: (row) => (
      <Link
        href={`/orders/${row.id}`}
        className="font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 no-underline"
      >
        <span>#{row.id}</span>
        <ExternalLink size={12} />
      </Link>
    ),
  },
  { key: 'store', header: 'Store' },
  { key: 'total', header: 'Total' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'date', header: 'Placed On' },
];

export default function CustomerAccountPage() {
  const { user } = useUserSession();
  const { data: roleData } = useRoleDashboardData(user);
  const [userName, setUserName] = useState<string>('Customer');
  const [recentOrders, setRecentOrders] = useState<CustomerOrderSummary[]>([]);
  const [addressCount, setAddressCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAccount() {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser && isMounted) {
          const metaName =
            (authUser.user_metadata?.full_name as string) ||
            (authUser.user_metadata?.name as string);
          if (metaName) {
            setUserName(metaName);
          } else {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', authUser.id)
              .maybeSingle();

            if (profile?.full_name && isMounted) {
              setUserName(profile.full_name);
            }
          }

          // Fetch real saved addresses count
          const { count: addrCount } = await supabase
            .from('customer_addresses')
            .select('id', { count: 'exact', head: true })
            .eq('customer_id', authUser.id);

          if (addrCount !== null && isMounted) {
            setAddressCount(addrCount);
          }

          // Fetch real customer orders
          const { data: groups } = await supabase
            .from('order_groups')
            .select(`
              id,
              status,
              payable_kobo,
              created_at,
              orders (
                id,
                store_id,
                stores (
                  name
                )
              )
            `)
            .eq('customer_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (groups && isMounted) {
            const mappedOrders: CustomerOrderSummary[] = groups.map((g) => {
              // Extract store name from first nested order
              const nestedOrders = (g.orders as unknown as Array<{ stores?: { name?: string } }>) || [];
              const storeName = nestedOrders[0]?.stores?.name || 'Vigil Partner Store';
              const dateStr = new Date(g.created_at).toLocaleDateString('en-NG', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return {
                id: g.id.slice(0, 8),
                store: storeName,
                total: `₦${((g.payable_kobo || 0) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
                status: g.status,
                date: dateStr,
              };
            });
            setRecentOrders(mappedOrders);
          }
        }
      } catch (err) {
        console.error('Error loading account data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAccount();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = user?.name || userName;
  const activeOrdersCount = String(roleData?.badgeCount ?? 0);

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Hello, {displayName}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Welcome to your customer dashboard. View active deliveries, reorder from favorites, and manage addresses.
        </p>
      </div>

      {/* StatCard Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={PackageSearch}
          label="Total Orders"
          value={String(recentOrders.length)}
          caption="Lifetime platform orders"
        />
        <StatCard
          icon={Clock}
          label="Active Orders"
          value={activeOrdersCount}
          caption="Currently in kitchen prep or transit"
        />
        <StatCard
          icon={MapPin}
          label="Saved Delivery Locations"
          value={String(addressCount)}
          caption="Verified addresses in Abeokuta"
        />
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/addresses"
          className="card p-5 group transition-all duration-200 hover:shadow-md hover:border-brand-500/40 no-underline"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
              <MapPin size={20} />
            </div>
            <ArrowRight size={16} className="text-neutral-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <h3 className="mt-4 font-bold text-ink text-base">Manage Addresses</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Add or update delivery addresses, landmark instructions, and phone contacts.
          </p>
        </Link>

        <Link
          href="/stores"
          className="card p-5 group transition-all duration-200 hover:shadow-md hover:border-brand-500/40 no-underline"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-ok/10 text-ok grid place-items-center">
              <ShoppingBag size={20} />
            </div>
            <ArrowRight size={16} className="text-neutral-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <h3 className="mt-4 font-bold text-ink text-base">Browse Stores</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Explore approved restaurants, local groceries, and cafes in your service area.
          </p>
        </Link>
      </div>

      {/* Recent Orders DataTable */}
      <DataTable
        title="Recent Orders"
        subtitle="Last 5 deliveries placed from your account"
        columns={columns}
        data={recentOrders.slice(0, 5)}
        emptyMessage="You have not placed any orders yet. Browse stores to make your first order!"
      />
    </div>
  );
}
