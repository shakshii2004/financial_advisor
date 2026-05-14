import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { analyticsService } from '../services/analyticsService';
import type { AnalyticsSummary, ChartData } from '../services/analyticsService';
import { startupService } from '../services/startupService';

import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/Skeleton';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [hasStartup, setHasStartup] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startups = await startupService.getAll();
        if (startups.length > 0) {
          setHasStartup(true);
          const startupId = startups[0].id;
          const [summaryData, chart] = await Promise.all([
            analyticsService.getSummary(startupId),
            analyticsService.getChartData(startupId)
          ]);
          setSummary(summaryData);
          setChartData(chart);
          setCurrency(startups[0].currency || 'USD');
        } else {
          setHasStartup(false);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardShell title="Financial Analytics" subtitle="Loading your insights...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-12 h-5 rounded-full" />
                </div>
                <Skeleton className="w-24 h-3 mb-2" />
                <Skeleton className="w-32 h-8" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-[500px]">
              <CardContent className="p-8 h-full flex flex-col justify-end gap-4">
                <Skeleton className="w-1/3 h-6 mb-8" />
                <div className="flex-1 flex items-end gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="h-[240px]">
              <CardContent className="p-8 flex flex-col justify-center gap-6">
                <Skeleton className="w-1/2 h-6" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-full h-2 rounded-full" />
                ))}
              </CardContent>
            </Card>
            <Card className="h-[230px]">
              <CardContent className="p-8 space-y-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-full h-16" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!hasStartup) {
    return (
      <DashboardShell title="Financial Analytics" subtitle="Comprehensive insights into your startup's growth.">
        <div className="flex flex-col items-center justify-center h-96 max-w-lg mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">No Data Available</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            You need to register a startup and log some transactions before we can generate financial analytics.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  // Map real data to display format
  const metrics = summary ? [
    { label: 'MRR Growth', value: `${summary.revenue_growth_percentage}%`, change: summary.revenue_growth_percentage >= 0 ? `+${summary.revenue_growth_percentage}%` : `${summary.revenue_growth_percentage}%`, icon: TrendingUp, positive: summary.revenue_growth_percentage >= 0, color: 'text-green-600' },
    { label: 'Net Profit', value: `${currencySymbol}${summary.net_profit}`, change: '', icon: Activity, positive: summary.net_profit >= 0, color: 'text-blue-600' },
    { label: 'Monthly Burn', value: `${currencySymbol}${summary.monthly_burn_rate}`, change: '', icon: Zap, positive: true, color: 'text-indigo-600' },
    { label: 'Runway', value: `${summary.runway_months} mo`, change: '', icon: TrendingDown, positive: summary.runway_months > 6, color: 'text-emerald-600' },
  ] : [];

  return (
    <DashboardShell
      title="Financial Analytics"
      subtitle="Comprehensive insights into your startup's growth, efficiency, and financial health."
    >
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:border-neutral-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center", metric.color)}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                    metric.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  )}>
                    {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {metric.change}
                  </div>
                </div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-neutral-900 tracking-tight">{metric.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader 
              title="Revenue vs Expenses" 
              subtitle="Monthly comparison of your operating income and burn rate."
            >
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-900" />
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tighter">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-200" />
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tighter">Expenses</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] flex items-end justify-between px-10 pb-12 gap-4">
              {chartData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div className="w-full flex items-end gap-1.5 h-[300px]">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(5, (data.revenue / Math.max(...chartData.map(d => Math.max(d.revenue, d.expense, 1)))) * 100)}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="flex-1 bg-neutral-900 rounded-t-lg relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {currencySymbol}{data.revenue}
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(5, (data.expense / Math.max(...chartData.map(d => Math.max(d.revenue, d.expense, 1)))) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className="flex-1 bg-neutral-200 rounded-t-lg relative"
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-200 text-neutral-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {currencySymbol}{data.expense}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{data.month}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Breakdown & Insights */}
        <div className="space-y-8">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader title="Revenue Mix" />
            <CardContent className="p-8 space-y-6">
              {[
                { label: 'SaaS Subscriptions', value: 75, color: 'bg-neutral-900' },
                { label: 'Professional Services', value: 15, color: 'bg-neutral-400' },
                { label: 'API Usage', value: 10, color: 'bg-neutral-200' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-neutral-500">{item.label}</span>
                    <span className="text-neutral-900">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-neutral-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card className="bg-indigo-600 text-white border-none">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">Efficiency Insight</p>
              </div>
              <p className="text-lg font-medium leading-snug">
                "Your LTV/CAC ratio has improved by 12% this month due to optimized referral channels."
              </p>
              <div className="pt-4 flex items-center gap-4 border-t border-white/10">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/20" />
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/20" />
                </div>
                <p className="text-xs text-indigo-100">Recommended by FinAI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};
