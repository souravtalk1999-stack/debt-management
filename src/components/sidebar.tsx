'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  TrendingUp,
  PiggyBank,
  Target,
  Bell,
  Settings,
  BarChart3,
  Wallet
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Loans', href: '/loans', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: Receipt },
  { name: 'Income', href: '/income', icon: Wallet },
  { name: 'Expenses', href: '/expenses', icon: TrendingUp },
  { name: 'Strategy', href: '/strategy', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reminders', href: '/reminders', icon: Bell },
  { name: 'Debt-Free Tracker', href: '/debt-free', icon: PiggyBank },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Debt Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-400">Sourav De</p>
        <p className="text-xs text-gray-500">sourav@example.com</p>
      </div>
    </div>
  );
}
