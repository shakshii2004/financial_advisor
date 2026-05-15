import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  TrendingUp, 
  Plus, 
  Filter, 
  Download, 
  ArrowUpRight,
  Search,
  Briefcase,
  Loader2
} from 'lucide-react';
import { cn, extractErrorMessage } from '../lib/utils';
import { transactionService } from '../services/transactionService';
import { startupService } from '../services/startupService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';
import { Modal } from '../components/Modal';

const revenueSchema = z.object({
  category: z.string({
    required_error: "Please specify the revenue source",
    invalid_type_error: "Please specify the revenue source",
  }).min(1, 'Please specify the revenue source'),
  amount: z.string({
    required_error: "Please enter an amount",
  }).min(1, 'Please enter an amount'),
  date: z.string({
    required_error: "Please select a date",
  }).min(1, "Please select a date"),
  description: z.string().optional(),
  currency: z.enum(['USD', 'INR']),
});

type RevenueForm = z.infer<typeof revenueSchema>;

export const RevenuePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch Startups
  const { data: startups = [] } = useQuery({
    queryKey: ['startups'],
    queryFn: () => startupService.getAll(),
  });

  const currencySymbol = startups[0]?.currency === 'INR' ? '₹' : '$';

  const { control, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm<RevenueForm>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      currency: startups[0]?.currency || 'USD'
    }
  });

  const selectedCurrency = watch('currency');

  // Fetch Revenue
  const { data: revenues = [], isLoading } = useQuery({
    queryKey: ['transactions', 'revenue'],
    queryFn: () => transactionService.getAll({ type: 'revenue' }),
  });

  // Create Revenue Mutation
  const createMutation = useMutation({
    mutationFn: (data: RevenueForm) => {
      if (startups.length === 0) throw new Error('No startup found to link revenue.');
      return transactionService.create({
        ...data,
        amount: parseFloat(data.amount),
        type: 'revenue',
        startup_id: startups[0].id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Revenue recorded successfully!');
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, 'Failed to record revenue.'));
    }
  });

  const onSubmit = (data: RevenueForm) => {
    createMutation.mutate(data);
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);

  const handleExportCSV = () => {
    if (revenues.length === 0) {
      toast.error('No revenue data to export');
      return;
    }

    const headers = ['Date', 'Source', 'Amount', 'Currency', 'Description'];
    const rows = revenues.map(r => [
      r.date,
      `"${r.category.replace(/"/g, '""')}"`,
      r.amount,
      r.currency,
      `"${(r.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revenue_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Revenue data exported');
  };

  if (isLoading) {
    return (
      <DashboardShell title="Revenue" subtitle="Loading your financial data...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-8">
                <Skeleton className="w-32 h-3 mb-2" />
                <Skeleton className="w-48 h-10 mb-4" />
                <Skeleton className="w-24 h-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="w-48 h-6" />
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-neutral-50 px-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="py-6 flex justify-between items-center">
                  <Skeleton className="w-24 h-4" />
                  <div className="flex items-center gap-3 w-1/3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-24 h-5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  if (startups.length === 0) {
    return (
      <DashboardShell title="Revenue" subtitle="Track your startup's income streams.">
        <div className="flex flex-col items-center justify-center h-96 max-w-lg mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">No Startup Linked</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Please register your startup profile first before recording any revenue transactions.
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
      title="Revenue"
      subtitle="Track your startup's income streams, MRR, and growth metrics."
      action={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Close Form' : 'Add Revenue'}
          </Button>
        </div>
      }
    >
      {/* Revenue Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card 
          onClick={() => window.location.href = '/analytics'}
          className="bg-neutral-900 text-white border-none relative overflow-hidden cursor-pointer group"
        >
          <CardContent className="p-8">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Total Revenue (Ledger)</p>
            <p className="text-4xl font-bold tracking-tight text-white">{currencySymbol}{totalRevenue.toLocaleString()}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>Tracking live growth</span>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => window.location.href = '/startups'}
          className="bg-white cursor-pointer group"
        >
          <CardContent className="p-8">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 group-hover:text-neutral-900 transition-colors">Active Startup</p>
            <p className="text-2xl font-bold text-neutral-900">{startups[0]?.name || 'Not Linked'}</p>
            <p className="text-xs text-neutral-500 mt-2">Primary entity</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-8">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Transactions</p>
            <p className="text-2xl font-bold text-neutral-900">{revenues.length}</p>
            <p className="text-xs text-neutral-500 mt-2">Historical count</p>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Record Revenue"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              control={control}
              name="category"
              label="Revenue Source"
              placeholder="e.g. Stripe Payout"
            />
            <FormInput
              control={control}
              name="amount"
              label="Amount"
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Currency</label>
              <div className="grid grid-cols-2 gap-3">
                {['USD', 'INR'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue('currency', c as 'USD' | 'INR')}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer",
                      selectedCurrency === c 
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-lg" 
                        : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-neutral-200"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <FormInput
              control={control}
              name="date"
              label="Date Received"
              type="date"
            />
          </div>
          <FormInput
            control={control}
            name="description"
            label="Notes"
            placeholder="Brief description"
          />
          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={createMutation.isPending} className="flex-1">
              Log Revenue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Revenue History Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-neutral-50/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h3 className="text-lg font-bold text-neutral-900">Revenue Ledger</h3>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Filter sources..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-300 transition-all"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-50">
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Source</th>
                  <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {revenues.map((revenue, i) => (
                  <motion.tr 
                    key={revenue.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-neutral-500">{revenue.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{revenue.category}</p>
                          <p className="text-xs text-neutral-500">{revenue.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-green-600">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          {revenue.currency === 'INR' ? '₹' : '$'}{Number(revenue.amount).toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-neutral-50 px-4">
            {revenues.map((revenue, i) => (
              <motion.div 
                key={revenue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="py-5 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-900">{revenue.category}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {revenue.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-sm font-black">
                      {revenue.currency === 'INR' ? '₹' : '$'}{Number(revenue.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500 font-medium">{revenue.description || 'No description'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
};
