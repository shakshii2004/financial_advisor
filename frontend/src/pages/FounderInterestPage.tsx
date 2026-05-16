import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Check, 
  X, 
  ExternalLink,
  Mail,
  Building2,
  Calendar,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api';
import { toast } from 'sonner';

export const FounderInterestPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: interests, isLoading } = useQuery({
    queryKey: ['founder-interests'],
    queryFn: async () => {
      const response = await apiClient.get('/investments/startup-interests');
      return response.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiClient.post('/investments/update-status', { 
        interest_id: id, 
        status 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founder-interests'] });
      toast.success('Interest status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interested':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">INITIAL INTEREST</span>;
      case 'discovery':
        return <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full border border-purple-100">DUE DILIGENCE</span>;
      case 'funding':
        return <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold rounded-full border border-orange-100">FUNDING CALL</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">CLOSED DEAL</span>;
      default:
        return <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-bold rounded-full border border-neutral-200 uppercase">{status}</span>;
    }
  };

  const handleMessageInvestor = (investorEmail: string, startupName: string) => {
    const subject = encodeURIComponent(`FounderFlow: Regarding your interest in ${startupName}`);
    const body = encodeURIComponent(`Hi,\n\nI saw your interest in ${startupName} on FounderFlow. I'd love to connect and share more about our progress.\n\nBest regards,`);
    window.location.href = `mailto:${investorEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8 pb-12 px-4 md:px-0">
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Investor Interests</h1>
        <p className="text-neutral-500">Manage incoming requests from potential investors and VCs.</p>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-neutral-50 rounded-3xl animate-pulse" />
          ))
        ) : interests?.length === 0 ? (
          <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">No interests yet</h3>
            <p className="text-neutral-500 max-w-sm mt-1">
              Your startups are live! As soon as an investor expresses interest, they will appear here.
            </p>
          </Card>
        ) : (
          interests?.map((interest: any) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card isHoverable className="overflow-hidden border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row lg:items-stretch">
                  <div className="p-6 md:p-8 flex-1 border-b lg:border-b-0 lg:border-r border-neutral-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-neutral-900/10">
                        {interest.user.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-neutral-900 leading-tight">{interest.user.name}</h3>
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium text-neutral-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {interest.user.email}
                        </p>
                      </div>
                    </div>

                    {interest.message && (
                      <div className="mb-6 p-5 bg-neutral-900/5 rounded-2xl flex gap-4 italic text-sm text-neutral-700 border border-neutral-100 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900/10" />
                        <MessageSquare className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">"{interest.message}"</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-100">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">Interested in <strong className="text-neutral-900">{interest.startup.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-100">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600 font-medium">{new Date(interest.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-neutral-50/40 lg:w-80 flex flex-col justify-center gap-4">
                    <div className="mb-2">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Current Status</p>
                      {getStatusBadge(interest.status)}
                    </div>

                    <div className="space-y-3">
                      {interest.status === 'interested' && (
                        <Button 
                          isLoading={updateStatusMutation.isPending && updateStatusMutation.variables?.status === 'discovery'}
                          onClick={() => updateStatusMutation.mutate({ id: interest.id, status: 'discovery' })}
                          className="w-full gap-2 h-11 rounded-xl font-bold shadow-lg shadow-neutral-900/5"
                        >
                          <Check className="w-4 h-4" /> Move to Discovery
                        </Button>
                      )}
                      {interest.status === 'discovery' && (
                        <Button 
                          isLoading={updateStatusMutation.isPending && updateStatusMutation.variables?.status === 'funding'}
                          onClick={() => updateStatusMutation.mutate({ id: interest.id, status: 'funding' })}
                          className="w-full gap-2 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold shadow-lg shadow-purple-200"
                        >
                          <TrendingUp className="w-4 h-4" /> Schedule Funding Call
                        </Button>
                      )}
                      {interest.status !== 'closed' && interest.status !== 'declined' && (
                        <Button 
                          variant="outline" 
                          isLoading={updateStatusMutation.isPending && updateStatusMutation.variables?.status === 'declined'}
                          onClick={() => updateStatusMutation.mutate({ id: interest.id, status: 'declined' })}
                          className="w-full gap-2 h-11 rounded-xl text-red-600 border-red-100 hover:bg-red-50 font-bold"
                        >
                          <X className="w-4 h-4" /> Decline Interest
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        onClick={() => handleMessageInvestor(interest.user.email, interest.startup.name)}
                        className="w-full gap-2 h-11 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold"
                      >
                        <Mail className="w-4 h-4" /> Message Investor
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
