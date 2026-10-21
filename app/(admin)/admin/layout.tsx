import { DashboardShell } from '@/components/dashboard/shell';

export const metadata = {
  title: 'Admin Operations',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
