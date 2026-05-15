import React, { useState } from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

/**
 * Premium Register Page with a clean, trust-focused interface.
 */
export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'founder' | 'investor'>('founder');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser, isLoading, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      if (user.role === 'investor') window.location.href = '/investor';
      else if (user.role === 'admin') window.location.href = '/admin';
      else window.location.href = '/dashboard';
    }
  }, [isAuthenticated, isLoading, user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = await authService.register({ 
        name, 
        email, 
        password, 
        role,
        password_confirmation: password // Simplify for demo, normally add a field
      });
      
      setUser(user);
      toast.success('Account created successfully! Welcome to FounderFlow.');
      window.location.href = role === 'founder' ? '/dashboard' : '/investor';
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50/50">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Brand & Social Proof */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block space-y-8"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900">FounderFlow</span>
            </div>
            
            <h1 className="text-5xl font-bold text-neutral-900 leading-tight">
              Join the elite <br />
              community of <br />
              <span className="text-neutral-400">modern founders.</span>
            </h1>

            <ul className="space-y-6">
              {[
                'Real-time financial analytics',
                'Investor-ready reporting',
                'Founder-first community',
                'Secure & production-grade architecture',
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-600 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-8 shadow-xl shadow-neutral-200/50">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">Create account</h2>
                <p className="text-neutral-500 text-sm mt-1">Select your role and enter your details</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Role Selector */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('founder')}
                    className={cn(
                      'p-4 rounded-2xl border text-left transition-all duration-200',
                      role === 'founder'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg cursor-default'
                        : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200 cursor-pointer'
                    )}
                  >
                    <span className="block font-bold">Founder</span>
                    <span className={cn('text-xs', role === 'founder' ? 'text-neutral-400' : 'text-neutral-500')}>
                      Manage your startup
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('investor')}
                    className={cn(
                      'p-4 rounded-2xl border text-left transition-all duration-200',
                      role === 'investor'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg cursor-default'
                        : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200 cursor-pointer'
                    )}
                  >
                    <span className="block font-bold">Investor</span>
                    <span className={cn('text-xs', role === 'investor' ? 'text-neutral-400' : 'text-neutral-500')}>
                      Discover opportunities
                    </span>
                  </button>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Jane Cooper"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    placeholder="jane@company.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Must be at least 8 characters"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    By signing up, you agree to our <a href="#" className="font-bold text-neutral-900 cursor-pointer">Terms of Service</a> and <a href="#" className="font-bold text-neutral-900 cursor-pointer">Privacy Policy</a>.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Create {role} account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <p className="text-center text-sm text-neutral-500 mt-8">
                Already have an account?{' '}
                <a href="/login" className="font-bold text-neutral-900 hover:underline cursor-pointer">
                  Log in here
                </a>
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
};
