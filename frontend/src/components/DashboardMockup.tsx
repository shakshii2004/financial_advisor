import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Search,
  LayoutDashboard,
  Users,
  PieChart,
  Settings,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * A high-fidelity, interactive dashboard preview built with React components.
 * Showcases the actual UI feel of FounderFlow directly on the landing page.
 */
export const DashboardMockup: React.FC = () => {
  const transactions = [
    { name: 'Stripe Payout', date: 'Just now', amount: '+$12,400', type: 'revenue' },
    { name: 'AWS Infrastructure', date: '2h ago', amount: '-$1,240', type: 'expense' },
    { name: 'Meta Ads', date: '5h ago', amount: '-$3,500', type: 'expense' },
    { name: 'Enterprise Sale', date: 'Yesterday', amount: '+$45,000', type: 'revenue' },
  ];

  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-neutral-200 shadow-2xl overflow-hidden flex h-[500px] md:h-[600px] text-left">
      {/* Mini Sidebar - Hidden on mobile/tablet screens */}
      <div className="hidden md:flex w-20 lg:w-64 border-r border-neutral-100 flex-col p-4 lg:p-6 bg-neutral-50/30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="hidden lg:block text-sm font-bold text-neutral-900 tracking-tight">FounderFlow</span>
        </div>
        
        <div className="space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: PieChart, label: 'Analytics' },
            { icon: Users, label: 'Investors' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <div 
              key={i}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer",
                item.active ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-14 md:h-16 border-b border-neutral-50 flex items-center justify-between px-4 md:px-8 bg-white/50 backdrop-blur-sm sticky top-0">
          <div className="flex items-center gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-neutral-50 rounded-xl border border-neutral-100 flex-1 max-w-[200px] md:max-w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] md:text-xs text-neutral-400 font-medium truncate">Search records...</span>
          </div>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-neutral-100 border border-neutral-200" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Revenue', value: '$84,200', change: '+12%', color: 'text-green-600', icon: TrendingUp },
              { label: 'Net Burn', value: '$12,400', change: '-5%', color: 'text-neutral-900', icon: Activity },
              { label: 'Runway', value: '18 Months', change: 'Healthy', color: 'text-neutral-900', icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", stat.color)}>{stat.change}</span>
                </div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Feed */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Recent Activity</h4>
                <Plus className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="space-y-4">
                {transactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        tx.type === 'revenue' ? "bg-green-50 text-green-600" : "bg-neutral-50 text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white"
                      )}>
                        {tx.type === 'revenue' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{tx.name}</p>
                        <p className="text-[10px] text-neutral-400 font-medium uppercase">{tx.date}</p>
                      </div>
                    </div>
                    <p className={cn("text-sm font-bold", tx.type === 'revenue' ? "text-green-600" : "text-neutral-900")}>
                      {tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Growth Chart (Mock Visual) */}
            <Card className="p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Growth Forecast</h4>
                  <p className="text-xs text-neutral-400 mt-1">Projected MRR based on current trend</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">+140%</span>
                </div>
              </div>
              
              <div className="flex items-end gap-2 h-40">
                {[40, 60, 45, 80, 100, 90, 120, 150].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 1 }}
                    className="flex-1 bg-neutral-100 rounded-t-lg relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
