'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TicketBadge from '@/components/dashboard/TicketBadge'; // update path as needed
import {
  ShieldAlert,
  Bell,
  ChevronLeft,
  ChevronRight,
 Users,
  CreditCard,
  Home,
 CalendarCheck,
  Settings,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [

  { label: 'Dashboard',     href: '/admin/dashboard',              icon: <Home className="w-5 h-5" /> },
  { label: 'Task',          href: '/admin/dashboard/tasks',         icon: <CalendarCheck className="w-5 h-5" /> },
  { label: 'Users',         href: '/admin/dashboard/user',          icon: <Users className="w-5 h-5" /> },
  { label: 'Subscriptions', href: '/admin/dashboard/subscriptions', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Reports',       href: '/admin/dashboard/report-user',   icon: <ShieldAlert className="w-5 h-5" /> },
  { label: 'Notifications', href: '/admin/dashboard/notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Settings',      href: '/admin/dashboard/settings',      icon: <Settings className="w-5 h-5" /> },
];


export default function AdminSidebar() {
  const pathname = usePathname();

  // Lazy initializer reads matchMedia once on mount — avoids setState inside effect body
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(min-width: 1024px)').matches;
  });

  // Only subscribe to future breakpoint changes — no synchronous setState in body
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setCollapsed(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{ width: collapsed ? '64px' : '260px' }}
      className="relative flex flex-col bg-white border-r border-gray-200 min-h-screen flex-shrink-0 transition-[width] duration-300 ease-in-out overflow-visible"
    >
    {/* ── Brand ── */}
<div className="h-[72px] flex items-center justify-center px-0 overflow-hidden">
  {collapsed ? (
    <Image
      src="/assets/images/logo.png"
      alt="99 Mint"
      width={32}
      height={32}
      className="object-contain shrink-0"
    />
  ) : (
   <div className="flex items-center gap-3 w-full px-6">
  <div className="scale-50 origin-left">
    <TicketBadge />
  </div>
  <span className="font-bold text-[20px] whitespace-nowrap">99Min Admin</span>
</div>
  )}
</div>

      {/* Divider */}
      <div className="mx-3 mb-4 h-px bg-gray-200" />

      {/* ── Nav ── */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto overflow-x-visible">
        {navItems.map((item) => {
  const active = isActive(item.href);
  return (
    <Link
      key={item.label}
      href={item.href}
      className={`group relative flex items-center rounded-xl transition-colors duration-150 ${
        collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
      } ${
        active
          ? 'bg-iconBg text-orange font-medium'
          : 'text-textGray hover:bg-gray-50 hover:text-textBlack'
      }`}
    >
      <span className="shrink-0">{item.icon}</span>

      {!collapsed && (
        <span className="text-sm whitespace-nowrap">{item.label}</span>
      )}

      {collapsed && (
        <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-[9999] bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
          {item.label}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
        </span>
      )}
    </Link>
  );
})}
      </nav>

      {/* ── Toggle button ── */}
      <div className="p-2 pb-6">
        <button
          type="button"
          onClick={() => setCollapsed((p) => !p)}
          className={`w-full flex items-center rounded-xl border border-gray-200 text-textGray hover:bg-gray-50 hover:text-textBlack transition-colors py-2.5 ${
            collapsed ? 'justify-center px-0' : 'justify-center gap-2 px-3'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}