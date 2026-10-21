'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  type DashboardRole,
  type DashboardMenuItem,
  ROLE_MENUS,
} from '@/lib/dashboard/menu';

interface SidebarProps {
  role: DashboardRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: DashboardMenuItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== '/' &&
      item.href !== '/merchant' &&
      item.href !== '/rider' &&
      item.href !== '/admin' &&
      pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.title : undefined}
      className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
        isActive
          ? 'border-l-4 border-brand-500 text-brand-500 bg-white/5 pl-2.5'
          : 'border-l-4 border-transparent text-white/70 hover:text-white hover:bg-white/5'
      } ${collapsed ? 'justify-center !px-2 !border-l-0' : ''}`}
    >
      <Icon
        size={19}
        className={`flex-none transition-transform duration-150 group-hover:scale-110 ${
          isActive ? 'text-brand-500' : 'text-white/60 group-hover:text-white'
        }`}
      />
      {!collapsed && <span className="truncate">{item.title}</span>}

      {/* Tooltip on collapsed rail */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 hidden rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white shadow-xl border border-white/10 whitespace-nowrap group-hover:block z-50">
          {item.title}
        </span>
      )}
    </Link>
  );
}

function NavCollapseItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: DashboardMenuItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isAnyChildActive = Boolean(
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
    )
  );
  const [open, setOpen] = useState(isAnyChildActive);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={collapsed ? item.title : undefined}
        className={`group relative flex w-full items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isAnyChildActive
            ? 'text-brand-500 bg-white/5'
            : 'text-white/70 hover:text-white hover:bg-white/5'
        } ${collapsed ? 'justify-center !px-2' : ''}`}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={19}
            className={`flex-none ${
              isAnyChildActive ? 'text-brand-500' : 'text-white/60 group-hover:text-white'
            }`}
          />
          {!collapsed && <span className="truncate">{item.title}</span>}
        </div>
        {!collapsed && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/40 group-hover:text-white"
          >
            <ChevronDown size={15} />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && !collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden pl-7 space-y-1"
          >
            {item.children?.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                collapsed={false}
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardSidebar({
  role,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const menuItems = ROLE_MENUS[role] || [];

  const roleLabels: Record<DashboardRole, string> = {
    merchant: 'Merchant Console',
    rider: 'Rider Portal',
    admin: 'Admin Console',
    customer: 'My Account',
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand / Logo Header */}
      <div
        className={`flex items-center h-16 px-4 border-b border-white/10 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-[19px] tracking-tight no-underline text-white"
        >
          <Image
            src="/assets/logo.png"
            alt="VigilXpress"
            width={32}
            height={32}
            priority
            className="flex-none"
          />
          {!collapsed && (
            <span className="truncate">
              Vigil<b className="text-brand-500">Xpress</b>
            </span>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Role Pill */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/70">
              {roleLabels[role]}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Navigation
            </p>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) =>
              item.children?.length ? (
                <NavCollapseItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onCloseMobile}
                />
              ) : (
                <NavItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onCloseMobile}
                />
              )
            )}
          </nav>
        </div>
      </div>

      {/* Footer / Desktop Rail Toggle */}
      <div className="hidden lg:flex items-center justify-between p-3 border-t border-white/10">
        {!collapsed && (
          <span className="text-[11px] text-white/40 font-medium px-2">
            Collapse Rail
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-ink/95 backdrop-blur-2xl border-r border-white/10 text-white transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 bg-ink/90 backdrop-blur-xl border-r border-white/10 text-white transition-[width] duration-200 ease-out ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
