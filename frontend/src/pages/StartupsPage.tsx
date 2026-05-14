import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Info,
  Loader2
} from 'lucide-react';
import { cn, extractErrorMessage } from '../lib/utils';
import { useAuthStore } from '../store/authStore';
import { startupService } from '../services/startupService';
import { mediaService } from '../services/mediaService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';
import type { Startup } from '../types/schema';

const startupSchema = z.object({
  name: z.string().min(2, 'Startup name required'),
  industry: z.string().min(2, 'Industry required'),
  stage: z.string().min(1),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  currency: z.enum(['USD', 'INR']),
});

type StartupForm = z.infer<typeof startupSchema>;

export const StartupsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Startup['stage']>('Seed');
  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue } = useForm<StartupForm>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      stage: 'Seed',
      currency: 'USD'
    }
  });

  // Fetch Startups
  const { data: startups = [], isLoading } = useQuery({
    queryKey: ['startups'],
    queryFn: () => startupService.getAll(),
  });

  // Create Startup Mutation
  const createMutation = useMutation({
    mutationFn: (data: StartupForm) => startupService.create({ ...data, stage: selectedStage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      toast.success('Startup registered successfully!');
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, 'Failed to register startup.'));
    }
  });

  const onSubmit = (data: StartupForm) => {
    createMutation.mutate(data);
  };

  const handleLogoUpload = async (startupId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const loadingToast = toast.loading('Uploading logo...');
      await mediaService.uploadLogo(startupId, file);
      toast.dismiss(loadingToast);
      toast.success('Logo updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['startups'] });
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to upload logo.'));
    }
  };

  const isFounder = user?.role === 'founder';
  const hasStartup = startups.length > 0;
  const canAddMore = !isFounder || !hasStartup;

  if (isLoading) {
    return (
      <DashboardShell title="My Startup Profile" subtitle="Loading your data...">
        <div className="grid grid-cols-1 gap-8">
          {[1, 2].map((i) => (
            <Card key={i} className="p-0 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                  <div className="flex items-center gap-6">
                    <Skeleton className="w-20 h-20 rounded-3xl" />
                    <div>
                      <Skeleton className="w-48 h-8 mb-2" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-16 h-4" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="w-24 h-8" />
                    <Skeleton className="w-32 h-8" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-8 border-y border-neutral-50 mb-8">
                  {[1, 2, 3].map((j) => (
                    <div key={j}>
                      <Skeleton className="w-24 h-3 mb-2" />
                      <Skeleton className="w-32 h-8 mb-1" />
                      <Skeleton className="w-20 h-3" />
                    </div>
                  ))}
                </div>
                <Skeleton className="w-full h-16" />
              </div>
            </Card>
          ))}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="My Startup Profile"
      subtitle={isFounder ? "Manage your primary startup identity and core metrics." : "Manage and track your associated startup profiles."}
      action={
        canAddMore && (
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Register Startup</>}
          </Button>
        )
      }
    >
      <AnimatePresence>
        {showForm && canAddMore && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <Card className="p-8 shadow-xl shadow-neutral-100 max-w-2xl border-neutral-900">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-900">Register Startup</h3>
                <p className="text-sm text-neutral-500 mt-1">Founders are limited to one primary startup profile.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    control={control}
                    name="name"
                    label="Startup Name"
                    placeholder="e.g. Acme Corp"
                  />
                  <FormInput
                    control={control}
                    name="industry"
                    label="Industry"
                    placeholder="e.g. Fintech, SaaS"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Base Currency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['USD', 'INR'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setValue('currency', c as 'USD' | 'INR')}
                          className={cn(
                            "px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-200",
                            control._formValues.currency === c 
                              ? "bg-neutral-900 border-neutral-900 text-white shadow-lg" 
                              : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-neutral-200"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Company Stage</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Idea', 'Seed', 'Series A', 'Growth'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSelectedStage(s as Startup['stage']);
                          setValue('stage', s);
                        }}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-200",
                          selectedStage === s 
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-lg" 
                            : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-neutral-200"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <FormInput
                  control={control}
                  name="website"
                  label="Website URL"
                  placeholder="https://acme.com"
                  type="url"
                />
                
                <FormInput
                  control={control}
                  name="description"
                  label="Mission Statement"
                  placeholder="Describe your vision in one sentence..."
                />

                <div className="pt-4 flex gap-4">
                  <Button type="submit" isLoading={createMutation.isPending} className="flex-1">
                    Complete Registration
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Discard
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-8">
        {startups.map((startup, i) => (
          <motion.div
            key={startup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-0 overflow-hidden group">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                  <div className="flex items-center gap-6">
                    <div className="relative group w-20 h-20">
                      {startup.logo_url ? (
                        <img 
                          src={startup.logo_url.startsWith('http') ? startup.logo_url : `http://localhost:8000${startup.logo_url}`} 
                          alt={`${startup.name} logo`} 
                          className="w-20 h-20 rounded-3xl object-cover shadow-xl shadow-neutral-200 bg-white"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-3xl bg-neutral-900 flex items-center justify-center text-white shadow-xl shadow-neutral-200">
                          <Building2 className="w-10 h-10" />
                        </div>
                      )}
                      
                      <label className="absolute inset-0 bg-black/50 text-white rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-opacity backdrop-blur-sm">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleLogoUpload(startup.id, e)}
                        />
                      </label>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">{startup.name}</h3>
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">{startup.industry}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase tracking-tighter">
                          {startup.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="font-bold text-xs">Edit Profile</Button>
                    <Button size="sm" className="font-bold text-xs">
                      Financial Workspace
                      <ChevronRight className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-8 border-y border-neutral-50 mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Funding</p>
                    <p className="text-2xl font-bold text-neutral-900 tracking-tight">{startup.currency === 'INR' ? '₹' : '$'}{startup.funding || '0'}</p>
                    <p className="text-xs text-neutral-500 mt-1">Based on records</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Current Valuation</p>
                    <p className="text-2xl font-bold text-neutral-900 tracking-tight">{startup.currency === 'INR' ? '₹' : '$'}{startup.valuation || '0'}</p>
                    <p className="text-xs text-green-600 font-bold mt-1">Target achieved</p>
                  </div>
                  <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-neutral-400" />
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Health Score</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-neutral-900">A+</p>
                      <span className="text-xs text-neutral-500">Platform Average</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500 max-w-2xl leading-relaxed">
                    {startup.description || 'No description provided.'}
                  </p>
                  {startup.website && (
                    <a 
                      href={startup.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 hover:opacity-70 transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {isFounder && hasStartup && (
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-neutral-500">
              You have reached your startup limit. Founders can manage one primary startup. 
              <button className="ml-2 font-bold text-neutral-900 hover:underline">Contact Support</button> to upgrade.
            </p>
          </div>
        )}

        {!hasStartup && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full h-full min-h-[300px] rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition-all group flex flex-col items-center justify-center p-8 gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-neutral-400 group-hover:text-neutral-900" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-neutral-900">Register your first startup</p>
              <p className="text-sm text-neutral-400 mt-1">Get started with professional financial tracking.</p>
            </div>
          </button>
        )}
      </div>
    </DashboardShell>
  );
};
