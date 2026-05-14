import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Rocket,
  Receipt,
  TrendingUp,
  BarChart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  Briefcase,
  ShieldAlert,
  FileText,
  HelpCircle,
  LifeBuoy
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'founder':
        return [
          { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
          { icon: Users, label: 'Investor Interests', href: '/investor-interests' },
          { icon: Rocket, label: 'My Startups', href: '/startups' },
          { icon: Receipt, label: 'Expenses', href: '/expenses' },
          { icon: TrendingUp, label: 'Revenue', href: '/revenue' },
          { icon: BarChart, label: 'Analytics', href: '/analytics' },
        ];
      case 'investor':
        return [
          { icon: LayoutDashboard, label: 'Portfolio', href: '/investor' },
          { icon: Search, label: 'Discovery', href: '/investor/discovery' },
          { icon: Briefcase, label: 'Funding Calls', href: '/investor/funding' },
          { icon: BarChart, label: 'Market Insights', href: '/analytics' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Admin Overview', href: '/admin' },
          { icon: Users, label: 'User Control', href: '/admin/users' },
          { icon: ShieldAlert, label: 'Moderation', href: '/admin/moderation' },
          { icon: FileText, label: 'Reports', href: '/admin/reports' },
        ];
      default:
        return [{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 w-[280px] bg-white border-r border-neutral-100 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-neutral-50">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">FounderFlow</span>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto scrollbar-hide">
          {/* Main Group */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Main Menu</p>
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive 
                    ? 'bg-neutral-900 text-white shadow-md shadow-neutral-200 cursor-default' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer'
                )}
              >
                <item.icon className={cn('w-5 h-5 transition-colors')} />
                <span className="text-sm font-semibold">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Investment Specific (for investors) */}
          {user?.role === 'investor' && (
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Investment Hub</p>
              <NavLink 
                to="/investor/funding"
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold',
                  isActive ? 'bg-neutral-900 text-white shadow-md cursor-default' : 'text-neutral-500 hover:bg-neutral-50 cursor-pointer'
                )}
              >
                <Briefcase className="w-5 h-5" />
                Active Deals
              </NavLink>
              <NavLink 
                to="/analytics"
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold',
                  isActive ? 'bg-neutral-900 text-white shadow-md cursor-default' : 'text-neutral-500 hover:bg-neutral-50 cursor-pointer'
                )}
              >
                <TrendingUp className="w-5 h-5" />
                Market Trends
              </NavLink>
            </div>
          )}
        </nav>

        {/* Secondary Navigation */}
        <div className="px-4 py-4 space-y-1 border-t border-neutral-50">
          <p className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Support</p>
          <NavLink 
            to="/help"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold',
              isActive 
                ? 'bg-neutral-900 text-white shadow-md shadow-neutral-200' 
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            )}
          >
            <LifeBuoy className="w-4 h-4" />
            Help Center
          </NavLink>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-50 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer',
              isActive && 'bg-neutral-50 text-neutral-900 cursor-default'
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-semibold">Settings</span>
          </NavLink>
          <button
            onClick={async () => {
              await logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
