import type { ReactNode } from 'react';
import {
  BarChart2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  Settings,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

export default function AdminSidebar() {
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '#',
      icon: <Home className="w-5 h-5" />,
      active: true,
    },
    {
      label: 'User',
      href: '/admin/dashboard/user',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: 'Role & Admin',
      href: '/admin/dashboard/role-admin',
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      label: 'Content Manager',
      href: '#',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: 'Submissions',
      href: '#',
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      label: 'Analytics',
      href: '#',
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '#',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
      {/* Sidebar Header / Brand */}
      <div className="h-[72px] px-6 flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange rounded flex items-center justify-center text-white font-bold text-xs transform -rotate-12">
            99
          </div>
          <span className="font-bold text-[15px]">99 Mint Admin</span>
        </div>
        <ChevronDown className="w-4 h-4 text-textGray" />
      </div>

      {/* Divider */}
      <div className="px-6 mb-4">
        <div className="h-px w-full bg-gray-200" />
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={
              item.active
                ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-iconBg text-orange font-medium transition-colors'
                : 'flex items-center gap-3 px-4 py-3 rounded-xl text-textGray hover:bg-gray-50 hover:text-textBlack transition-colors'
            }
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
