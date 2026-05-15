import React from 'react';
import { motion } from 'framer-motion';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  ArrowRight, 
  Plus,
  Calendar,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { startupService } from '../services/startupService';
import { transactionService } from '../services/transactionService';
import { Skeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';

export const FounderDashboard: React.FC = () => {
  const { data: startups = [] } = useQuery({
    queryKey: ['startups'],
    queryFn: () => startupService.getAll(),
  });

  const startupId = startups[0]?.id;
  const currencySymbol = startups[0]?.currency === 'INR' ? '₹' : '$';

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['analytics-summary', startupId],
    queryFn: () => startupId ? analyticsService.getSummary(startupId) : null,
    enabled: !!startupId,
  });

  const [timeFilter, setTimeFilter] = React.useState<'all' | 'month'>('all');
  
  const { data: transactions = [], isLoading: isTxLoading } = useQuery({
    queryKey: ['transactions', startupId],
    queryFn: () => transactionService.getAll({ startup_id: startupId }),
    enabled: !!startupId,
  });

  const isLoading = isSummaryLoading || isTxLoading;

  // Filter transactions based on selected time period
  const filteredTransactions = React.useMemo(() => {
    if (timeFilter === 'all') return transactions;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startOfMonth;
    });
  }, [transactions, timeFilter]);

  const recentTransactions = filteredTransactions.slice(0, 5);

  const stats = summary ? [
    {
      label: 'Net Revenue',
      value: `${currencySymbol}${summary.total_revenue.toLocaleString()}`,
      change: `${summary.revenue_growth_percentage > 0 ? '+' : ''}${summary.revenue_growth_percentage}%`,
      icon: DollarSign,
      trend: summary.revenue_growth_percentage >= 0 ? 'up' : 'down',
      description: 'vs last month'
    },
    {
      label: 'Monthly Burn',
      value: `${currencySymbol}${summary.monthly_burn_rate.toLocaleString()}`,
      change: 'stable',
      icon: Activity,
      trend: 'neutral',
      description: 'optimized'
    },
    {
      label: 'Runway',
      value: `${summary.runway_months} Months`,
      change: summary.runway_months > 6 ? 'safe' : 'low',
      icon: Clock,
      trend: summary.runway_months > 6 ? 'up' : 'down',
      description: summary.runway_months > 6 ? 'healthy' : 'critical'
    },
    {
      label: 'Net Profit',
      value: `${currencySymbol}${summary.net_profit.toLocaleString()}`,
      change: `${summary.net_profit > 0 ? '+' : ''}`,
      icon: Wallet,
      trend: summary.net_profit > 0 ? 'up' : 'down',
      description: 'operating margin'
    },
  ] : [];


  if (isLoading) {
    return (
      <DashboardShell key="loading" title="Founder Dashboard" subtitle="Loading your workspace...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card><CardContent className="p-6 h-96"><Skeleton className="h-full w-full" /></CardContent></Card>
          </div>
          <div className="space-y-8">
            <Card><CardContent className="p-6 h-48"><Skeleton className="h-full w-full" /></CardContent></Card>
            <Card><CardContent className="p-6 h-48"><Skeleton className="h-full w-full" /></CardContent></Card>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!startupId) {
    return (
      <DashboardShell key="empty" title="Founder Dashboard" subtitle="Good morning! Let's set up your workspace.">
        <div className="flex flex-col items-center justify-center h-96 max-w-lg mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">Welcome to FounderFlow</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Please register your first startup profile to unlock the financial dashboard.
          </p>
          <Button onClick={() => window.location.href = '/startups'} className="mt-4">
            Register Startup
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      key="main"
      title="Founder Dashboard"
      subtitle="Good morning! Here's what's happening with your startup today."
      action={
        <Button onClick={() => window.location.href = '/startups'}>
          <Plus className="w-4 h-4 mr-2" />
          Add Startup
        </Button>
      }
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="h-full group hover:border-neutral-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                    stat.trend === 'up' ? "bg-green-50 text-green-700" : 
                    stat.trend === 'down' ? "bg-red-50 text-red-700" : 
                    "bg-neutral-50 text-neutral-600"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
                     stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                    {stat.change}
                  </div>
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
                </div>
                <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-wider font-bold">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader 
              title="Financial Activity" 
              subtitle="Latest revenue and expenses across all linked accounts."
            >
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  variant={timeFilter === 'all' ? 'secondary' : 'ghost'} 
                  className="text-xs h-8"
                  onClick={() => setTimeFilter('all')}
                >
                  All Time
                </Button>
                <Button 
                  size="sm" 
                  variant={timeFilter === 'month' ? 'secondary' : 'ghost'} 
                  className="text-xs h-8"
                  onClick={() => setTimeFilter('month')}
                >
                  This Month
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-50">
                      <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Transaction</th>
                      <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</th>
                      <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-neutral-50 transition-colors cursor-pointer">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              tx.type === 'revenue' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}>
                              {tx.type === 'revenue' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">{tx.description}</p>
                              <p className="text-xs text-neutral-500">{tx.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase tracking-tight">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <p className={cn(
                            "text-sm font-bold",
                            tx.type === 'revenue' ? "text-green-600" : "text-neutral-900"
                          )}>
                            {tx.type === 'revenue' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-neutral-50">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 space-y-3 cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          tx.type === 'revenue' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                          {tx.type === 'revenue' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{tx.description}</p>
                          <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight">{tx.category}</p>
                        </div>
                      </div>
                      <p className={cn(
                        "text-sm font-bold",
                        tx.type === 'revenue' ? "text-green-600" : "text-neutral-900"
                      )}>
                        {tx.type === 'revenue' ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-medium">{tx.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-neutral-50 flex justify-center">
              <Button variant="ghost" size="sm" className="text-xs font-bold" onClick={() => window.location.href = '/expenses'}>
                View All Transactions
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent className="space-y-2 p-4">
              {[
                { label: 'Log New Expense', icon: Plus, href: '/expenses' },
                { label: 'Record Revenue', icon: DollarSign, href: '/revenue' },
                { label: 'Export Monthly Report', icon: BarChart, href: '/analytics' },
                { label: 'Request Bridge Funding', icon: Wallet, href: '/dashboard' },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-neutral-900">{action.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Runway Progress Card */}
          {summary && (
            <Card className="bg-neutral-900 text-white border-none">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em]">Next Funding Goal</p>
                    <p className="text-lg font-bold text-white tracking-tight">18-Month Runway Target</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                    <span className="text-neutral-300">Preparation Progress</span>
                    <span className="text-white">{Math.min(100, Math.round((summary.runway_months / 18) * 100))}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (summary.runway_months / 18) * 100)}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                  {summary.runway_months > 12 
                    ? "Your financials are healthy. We recommend initiating investor outreach in 60 days."
                    : "Your runway is tightening. Consider optimizing burn or preparing for a bridge round."}
                </p>
                
                <Button variant="secondary" size="sm" className="w-full" onClick={() => window.location.href = '/analytics'}>
                  View Analytics Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};
