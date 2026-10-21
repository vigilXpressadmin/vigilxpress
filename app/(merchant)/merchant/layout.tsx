import { DashboardShell } from '@/components/dashboard/shell';

export const metadata = {
  title: 'Merchant Dashboard',
};

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="merchant">{children}</DashboardShell>;
}
