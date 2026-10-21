import { DashboardShell } from '@/components/dashboard/shell';

export const metadata = {
  title: 'Rider Dashboard',
};

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="rider">{children}</DashboardShell>;
}
