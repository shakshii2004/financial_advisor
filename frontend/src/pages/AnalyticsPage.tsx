import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { analyticsService } from '../services/analyticsService';
import type { AnalyticsSummary, ChartData } from '../services/analyticsService';
import { startupService } from '../services/startupService';

import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { transactionService } from '../services/transactionService';
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
  const [revenueMix, setRevenueMix] = useState<{ label: string, value: number, color: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startups = await startupService.getAll();
        if (startups.length > 0) {
          setHasStartup(true);
          const startupId = startups[0].id;
          const [summaryData, chart, transactions] = await Promise.all([
            analyticsService.getSummary(startupId),
            analyticsService.getChartData(startupId),
            transactionService.getAll({ startup_id: startupId, type: 'revenue' })
          ]);
          setSummary(summaryData);
          setChartData(chart);
          setCurrency(startups[0].currency || 'USD');

          // Calculate Revenue Mix
          if (transactions.length > 0) {
            const totalsByCategory: Record<string, number> = {};
            let totalAmount = 0;
            
            transactions.forEach(tx => {
              const amount = Number(tx.amount);
              totalsByCategory[tx.category] = (totalsByCategory[tx.category] || 0) + amount;
              totalAmount += amount;
            });

            const mix = Object.entries(totalsByCategory)
              .map(([label, amount]) => ({
                label,
                value: Math.round((amount / totalAmount) * 100),
                color: 'bg-neutral-900' // We can rotate colors or just use consistent neutral shades
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5); // Top 5 categories

            // Apply different shades for visual distinction
            const shades = ['bg-neutral-900', 'bg-neutral-600', 'bg-neutral-400', 'bg-neutral-200', 'bg-neutral-100'];
            setRevenueMix(mix.map((item, i) => ({ ...item, color: shades[i % shades.length] })));
          }
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
            <CardContent className="h-[450px] overflow-x-auto no-scrollbar relative pt-16">
              {chartData.every(d => d.revenue === 0 && d.expense === 0) && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">No transactions found</h4>
                  <p className="text-sm text-neutral-500 mb-6">Record your first revenue or expense to see insights.</p>
                  <Button size="sm" onClick={() => window.location.href = '/expenses'}>
                    Record Transaction
                  </Button>
                </div>
              )}
              <div className="h-full flex items-end justify-between px-10 pb-12 gap-4 min-w-[600px] lg:min-w-0">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div className="w-full flex items-end gap-1.5 h-[280px]">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(5, (data.revenue / Math.max(...chartData.map(d => Math.max(d.revenue, d.expense, 1)))) * 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="flex-1 bg-neutral-900 rounded-t-lg relative"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                          {currencySymbol}{data.revenue}
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(5, (data.expense / Math.max(...chartData.map(d => Math.max(d.revenue, d.expense, 1)))) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                        className="flex-1 bg-neutral-200 rounded-t-lg relative"
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-200 text-neutral-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                          {currencySymbol}{data.expense}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown & Insights */}
        <div className="space-y-8">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader title="Revenue Mix" subtitle="Distribution of income sources by category." />
            <CardContent className="p-8 space-y-6">
              {revenueMix.length > 0 ? (
                revenueMix.map((item, i) => (
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
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No revenue data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Minimalist Quote Card */}
          <Card className="bg-neutral-900 text-white border-none relative overflow-hidden group">
            <CardContent className="p-10 flex flex-col justify-center items-center text-center">
              <p className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-white">
                "The best way to predict the future is to <span className="text-indigo-300 italic">create it</span>."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};
