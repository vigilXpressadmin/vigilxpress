import { DashboardShell } from '@/components/dashboard/shell';

export const metadata = {
  title: 'My Orders',
};

export default function CustomerOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="customer">{children}</DashboardShell>;
}
