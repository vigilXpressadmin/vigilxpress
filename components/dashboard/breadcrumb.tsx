'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { getTitleForPath } from '@/lib/dashboard/menu';

export function DashboardBreadcrumb({ role }: { role: string }) {
  const pathname = usePathname();

  // Split path into segments
  const segments = pathname.split('/').filter(Boolean);

  // Build crumbs
  const crumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((seg, idx) => {
    currentPath += `/${seg}`;
    const isLast = idx === segments.length - 1;
    const label = isLast
      ? getTitleForPath(pathname)
      : getTitleForPath(currentPath);
    crumbs.push({ label, href: currentPath });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 font-medium flex-wrap"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-brand-500 transition-colors"
      >
        <Home size={13} className="text-neutral-400" />
        <span className="sr-only">Home</span>
      </Link>

      {crumbs.slice(1).map((crumb, i) => {
        const isLast = i === crumbs.length - 2;
        return (
          <div key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-neutral-400 flex-none" />
            {isLast ? (
              <span className="text-neutral-900 font-semibold" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-brand-500 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
