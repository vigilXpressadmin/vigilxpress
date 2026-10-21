import { DashboardShell } from '@/components/dashboard/shell';

export const metadata = {
  title: 'Customer Account',
};

export default function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="customer">{children}</DashboardShell>;
}
