import React, { useState } from 'react';
import { DashboardShell } from '../components/DashboardShell';
import { Card } from '../components/Card';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Search, Filter, Briefcase, TrendingUp, Sparkles, Building2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Startup {
  id: number;
  name: string;
  industry: string;
  description: string;
  stage: string;
  currency: string;
  fundingRequests?: any[];
}

export const InvestorDiscoveryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Fetch startups from the discovery endpoint
  const { data: startups = [], isLoading } = useQuery({
    queryKey: ['investor-discovery'],
    queryFn: async () => {
      const response = await apiClient.get('/investments/discovery');
      return response.data.data;
    },
  });

  const handleExpressInterest = async (startupId: number) => {
    try {
      await apiClient.post('/investments/interest', { startup_id: startupId });
      toast.success('Interest expressed! The founder will be notified.');
    } catch (error) {
      toast.error('Failed to express interest. Try again.');
    }
  };

  const filteredStartups = startups.filter((startup: Startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || startup.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['All', ...Array.from(new Set(startups.map((s: Startup) => s.industry)))];

  return (
    <DashboardShell 
      title="Startup Discovery" 
      subtitle="Browse and filter high-growth startups seeking capital."
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-900/5 transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-neutral-400 mr-2" />
          {industries.map((industry: any) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedIndustry === industry 
                  ? 'bg-neutral-900 text-white shadow-md shadow-neutral-200' 
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-neutral-100 h-64 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredStartups.map((startup: Startup, index: number) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="flex flex-col h-full hover:shadow-xl hover:shadow-neutral-200/40 transition-all duration-300 group overflow-hidden">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                        {startup.name.charAt(0)}
                      </div>
                      <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" />
                        {startup.stage}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {startup.name}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {startup.industry}
                    </p>
                    
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                      {startup.description}
                    </p>

                    <div className="pt-6 border-t border-neutral-100 flex items-center justify-between mt-auto">
                      <button 
                        onClick={() => handleExpressInterest(startup.id)}
                        className="text-sm font-bold text-neutral-900 flex items-center gap-2 hover:opacity-70 transition-opacity"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Express Interest
                      </button>
                      
                      <button className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!isLoading && filteredStartups.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">No startups found</h3>
          <p className="text-sm text-neutral-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </DashboardShell>
  );
};
