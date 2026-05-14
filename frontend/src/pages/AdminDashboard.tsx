import React from 'react';
import { motion } from 'framer-motion';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  MoreVertical, 
  ArrowUpRight,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  // Mock platform-wide data
  const stats = [
    { label: 'Platform Users', value: '1,243', change: '+12.5%', icon: Users },
    { label: 'Active Startups', value: '324', change: '+8.2%', icon: Zap },
    { label: 'Funding Volume', value: '$84M', change: '+5.4%', icon: TrendingUp },
    { label: 'Security Alerts', value: '0', change: 'Stable', icon: Lock },
  ];

  const moderationQueue = [
    { id: 1, type: 'Startup Verification', target: 'NexaCloud AI', user: 'Jane Smith', date: '10m ago' },
    { id: 2, type: 'KYC Review', target: 'Mark Verdon', user: 'Investor', date: '45m ago' },
    { id: 3, type: 'Flagged Content', target: 'Report #429', user: 'System', date: '2h ago' },
  ];

  const recentUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'founder', status: 'verified' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'investor', status: 'verified' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'founder', status: 'pending' },
  ];

  return (
    <DashboardShell
      title="Platform Moderation"
      subtitle="Monitor platform activity, manage user roles, and handle moderation requests."
    >
      {/* Global Stats */}
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
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{stat.change}</span>
                </div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Moderation Queue */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader 
              title="Moderation Queue" 
              subtitle="Pending requests that require admin authorization."
            />
            <CardContent className="px-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-50">
                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Target</th>
                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Requested By</th>
                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {moderationQueue.map((item) => (
                    <tr key={item.id} className="group hover:bg-neutral-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-neutral-900">{item.type}</span>
                        <p className="text-[10px] text-neutral-400 font-medium uppercase mt-0.5">{item.date}</p>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-neutral-600">{item.target}</td>
                      <td className="px-8 py-5 text-sm text-neutral-500">{item.user}</td>
                      <td className="px-8 py-5 text-right">
                        <Button variant="outline" size="sm" className="text-[10px] font-bold h-8 px-4">Review</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <div className="p-4 border-t border-neutral-50 flex justify-center">
              <Button variant="ghost" size="sm" className="text-xs font-bold">
                View Full Queue
                <ArrowUpRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader title="User Management" subtitle="Manage account status and roles." />
            <CardContent className="p-4 space-y-2">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-neutral-50 hover:border-neutral-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold uppercase text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      user.status === 'verified' ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    )}>
                      {user.status}
                    </span>
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Platform Insights Sidebar */}
        <div className="space-y-8">
          <Card className="bg-neutral-900 text-white border-none">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Platform Integrity</p>
                  <p className="text-lg font-bold text-white">System Healthy</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-neutral-400">
                  <span>Server Load</span>
                  <span>14%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[14%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold">2.4k</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">API Req/s</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Uptime</p>
                </div>
              </div>

              <Button variant="secondary" size="sm" className="w-full">System Status Page</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Admin Logs" />
            <CardContent className="p-6 space-y-4">
              {[
                { label: 'Admin (Sarah)', action: 'Verified NexaCloud AI', date: '10m ago' },
                { label: 'System', action: 'Automated DB Backup', date: '1h ago' },
                { label: 'Admin (Mike)', action: 'Updated Global Tax Rules', date: '3h ago' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 mt-2 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{log.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{log.action}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">{log.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};
