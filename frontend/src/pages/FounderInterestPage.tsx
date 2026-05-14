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

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Investor Interests</h1>
        <p className="text-neutral-500">Manage incoming requests from potential investors and VCs.</p>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-neutral-50 rounded-3xl animate-pulse" />
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
              <Card isHoverable className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-neutral-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {interest.user.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-neutral-900">{interest.user.name}</h3>
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-sm text-neutral-500">{interest.user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span>Interested in <strong>{interest.startup.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span>{new Date(interest.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {interest.message && (
                      <div className="mt-6 p-4 bg-neutral-50 rounded-2xl flex gap-3 italic text-sm text-neutral-600 border border-neutral-100">
                        <MessageSquare className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        "{interest.message}"
                      </div>
                    )}
                  </div>

                  <div className="p-8 bg-neutral-50/30 md:w-80 flex flex-col justify-center gap-4">
                    <div className="mb-2">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Current Status</p>
                      {getStatusBadge(interest.status)}
                    </div>

                    <div className="space-y-2">
                      {interest.status === 'interested' && (
                        <Button 
                          onClick={() => updateStatusMutation.mutate({ id: interest.id, status: 'discovery' })}
                          className="w-full gap-2"
                        >
                          <Check className="w-4 h-4" /> Move to Discovery
                        </Button>
                      )}
                      {interest.status === 'discovery' && (
                        <Button 
                          onClick={() => updateStatusMutation.mutate({ id: interest.id, status: 'funding' })}
                          className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <TrendingUp className="w-4 h-4" /> Schedule Funding Call
                        </Button>
                      )}
                      {interest.status !== 'closed' && (
                        <Button variant="outline" className="w-full gap-2 text-red-600 border-red-100 hover:bg-red-50">
                          <X className="w-4 h-4" /> Decline Interest
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full gap-2 text-neutral-500">
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
