import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { startupService } from '../services/startupService';
import { investmentService } from '../services/investmentService';
import type { Startup } from '../types/schema';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/Skeleton';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Globe, 
  Users, 
  ArrowUpRight, 
  ShieldCheck,
  Zap,
  Building2,
  PieChart
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Clock, X } from 'lucide-react';
import { toast } from 'sonner';

export const InvestorDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const queryClient = useQueryClient();

  // Real Stats Query
  const { data: realStats } = useQuery({
    queryKey: ['investor-summary'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/investor/summary');
      return response.data.data;
    },
  });

  // Express Interest Mutation
  const expressInterest = useMutation({
    mutationFn: async (startupId: number) => {
      const response = await apiClient.post('/investments/interest', {
        startup_id: startupId,
        status: 'interested'
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Interest expressed successfully!');
      queryClient.invalidateQueries({ queryKey: ['investor-summary'] });
      queryClient.invalidateQueries({ queryKey: ['investor-interests'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to express interest');
    }
  });

  const stats = [
    { 
      label: 'Portfolio Value', 
      value: realStats ? `$${(realStats.portfolio_value / 1000000).toFixed(1)}M` : '$0.0M', 
      change: '+0.0%', 
      icon: TrendingUp 
    },
    { 
      label: 'Active Investments', 
      value: realStats?.active_investments?.toString() || '0', 
      change: '0 pending', 
      icon: Building2 
    },
    { 
      label: 'Pending Interests', 
      value: realStats?.pending_interests?.toString() || '0', 
      change: 'Active', 
      icon: Zap 
    },
    { 
      label: 'Combined Runway', 
      value: realStats?.avg_runway || '0m', 
      change: 'avg', 
      icon: Clock 
    },
  ];

  const [startups, setStartups] = useState<Startup[]>([]);
  const [portfolio, setPortfolio] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allStartups, myPortfolio] = await Promise.all([
          apiClient.get('/investments/discovery').then(res => res.data.data),
          investmentService.getPortfolio()
        ]);
        setStartups(allStartups);
        setPortfolio(myPortfolio);
      } catch (error) {
        console.error('Failed to fetch investor data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardShell key="loading" title="Investor Command Center" subtitle="Loading marketplace...">
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
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="w-48 h-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-64 flex flex-col justify-between p-6">
                  <div>
                    <div className="flex justify-between mb-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-48 h-6 mb-2" />
                    <Skeleton className="w-24 h-3 mb-4" />
                    <Skeleton className="w-full h-12" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <Card className="h-96">
              <CardHeader>
                <Skeleton className="w-48 h-6 mb-2" />
                <Skeleton className="w-32 h-4" />
              </CardHeader>
            </Card>
            <Card className="h-48" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  const filteredStartups = startups.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.industry && s.industry.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardShell
      key="main"
      title="Investor Command Center"
      subtitle="Monitor your portfolio and discover high-growth investment opportunities."
    >
      {/* Portfolio Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:border-neutral-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.change}</span>
                </div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Discovery Section */}
        <div className="lg:col-span-2 space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-neutral-900">Marketplace</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all w-full"
                />
              </div>
              <Button variant="outline" size="icon" className="hidden sm:flex">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStartups.map((startup, i) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card isHoverable className="p-0 overflow-hidden h-full flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                        {startup.traction}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-neutral-900 mb-2">{startup.name}</h4>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">{startup.industry || 'Unknown'}</p>
                    <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-6">
                      {startup.description || 'No description provided.'}
                    </p>

                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-neutral-400 uppercase tracking-widest">Valuation</span>
                        <span className="text-neutral-900">
                          {(startup.valuation || 0) > 0 
                            ? `${startup.currency === 'INR' ? '₹' : '$'}${((startup.valuation || 0) / 1000000).toFixed(1)}M`
                            : 'Pre-Valuation'
                          }
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${startup.funding_progress || 0}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="h-full bg-neutral-900" 
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                           <span>{startup.funding_progress || 0}% Raised</span>
                           <span>
                             {startup.funding_requests && startup.funding_requests.length > 0
                               ? `Target: ${startup.currency === 'INR' ? '₹' : '$'}${((startup.funding_requests[0].target_amount || 0) / 1000).toFixed(0)}K`
                               : 'No Active Round'
                             }
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 border-t border-neutral-100 mt-auto flex gap-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1 text-xs font-bold"
                      onClick={() => setSelectedStartup(startup)}
                    >
                      Analyze Data
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs font-bold"
                      disabled={expressInterest.isPending}
                      onClick={() => expressInterest.mutate(startup.id)}
                    >
                      {expressInterest.isPending ? 'Processing...' : 'Invest Now'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Portfolio Activity Sidebar */}
        <div className="space-y-8">
          <Card>
            <CardHeader title="Portfolio Activity" subtitle="Updates from your investments." />
            <CardContent className="p-4 space-y-1">
              {portfolio.length > 0 ? portfolio.map((p, i) => (
                <div key={i} className="p-4 rounded-xl hover:bg-neutral-50 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-sm font-bold text-neutral-900">{p.name}</h5>
                    <span className="text-[10px] text-neutral-400 font-medium">{p.stage || 'Seed'}</span>
                  </div>
                  <p className="text-xs text-neutral-500 group-hover:text-neutral-700 transition-colors">{p.industry}</p>
                </div>
              )) : (
                <div className="p-4 text-center text-sm text-neutral-500">No investments yet.</div>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-4 text-xs font-bold">
                View Full Activity Log
                <ArrowUpRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 text-white border-none">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Compliance Status</p>
                  <p className="text-lg font-bold">Verified Investor</p>
                </div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Your investment limit is currently <strong>$50M/year</strong>. Complete the KYC update to increase.
              </p>
              <Button variant="secondary" size="sm" className="w-full">Update Credentials</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Room Modal */}
      <DataRoomModal 
        startup={selectedStartup} 
        onClose={() => setSelectedStartup(null)} 
      />
    </DashboardShell>
  );
};

// Sub-component for the Data Room to keep things clean
const DataRoomModal: React.FC<{ startup: Startup | null, onClose: () => void }> = ({ startup, onClose }) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['startup-analytics', startup?.id],
    queryFn: async () => {
      if (!startup) return null;
      const [summary, chart] = await Promise.all([
        apiClient.get(`/analytics/summary?startup_id=${startup.id}`),
        apiClient.get(`/analytics/chart?startup_id=${startup.id}&period=1y`)
      ]);
      return { summary: summary.data.data, chart: chart.data.data };
    },
    enabled: !!startup,
  });

  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-bold text-neutral-900">{startup.name} Data Room</h2>
                {analytics?.summary?.is_verified ? (
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED DATA
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-bold rounded-full border border-neutral-200">
                    ESTIMATED / DEFAULT
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-500">Live analytics and verification metrics.</p>
            </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-neutral-500" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto scrollbar-hide max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-8">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
              <Skeleton className="h-64 rounded-2xl w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Traction</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-900">
                    {analytics?.summary.revenue_growth_percentage > 0 ? `+${analytics?.summary.revenue_growth_percentage}% MoM` : 'Stable Growth'}
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Verified Revenue</p>
                  <p className="text-xl md:text-2xl font-bold text-purple-900">
                    ${(analytics?.summary.total_revenue / 1000).toFixed(1)}K Total
                  </p>
                </div>
                <div className="p-6 bg-orange-50 rounded-2xl">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Runway</p>
                  <p className="text-xl md:text-2xl font-bold text-orange-900">
                    {analytics?.summary.runway_months || '24+'} Months
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-neutral-900">Revenue Performance (Real-time)</h3>
                  <div className="h-64 w-full bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 flex items-end gap-1 p-4">
                        {analytics?.chart.map((data: any, i: number) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(10, (data.revenue / (Math.max(...analytics.chart.map((d: any) => d.revenue)) || 1)) * 100)}%` }}
                            transition={{ delay: i * 0.1, duration: 1 }}
                            className="flex-1 bg-neutral-900 rounded-t-lg group relative"
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ${data.revenue.toLocaleString()}
                            </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (analytics?.summary.pitch_deck_url === '#') {
                          toast.error('No pitch deck uploaded yet.');
                        } else {
                          window.open(analytics?.summary.pitch_deck_url, '_blank');
                        }
                      }}
                    >
                      Download Pitch Deck
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Requesting access to detailed Cap Table...')}
                    >
                      Request Detailed Audit
                    </Button>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-neutral-900">Cap Table Distribution</h3>
                  <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                    <div className="flex items-center justify-center mb-8 relative">
                      {/* Simple SVG Pie Chart */}
                      <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                        {(analytics?.summary?.cap_table || []).reduce((acc: any, item: any, i: number) => {
                          const startAngle = acc.totalAngle;
                          const endAngle = startAngle + (item.equity / 100) * 360;
                          const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
                          const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
                          const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
                          const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);
                          const largeArc = item.equity > 50 ? 1 : 0;
                          
                          acc.elements.push(
                            <motion.path
                              key={i}
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={item.color || '#e5e5e5'}
                              className="hover:opacity-80 cursor-pointer transition-opacity"
                            />
                          );
                          acc.totalAngle = endAngle;
                          return acc;
                        }, { elements: [], totalAngle: 0 }).elements}
                        <circle cx="50" cy="50" r="25" fill="white" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Post-Money</span>
                        <span className="text-lg font-bold text-neutral-900">100%</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(analytics?.summary?.cap_table || []).map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#e5e5e5' }} />
                            <span className="text-sm font-medium text-neutral-700">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-neutral-900">{item.equity}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
