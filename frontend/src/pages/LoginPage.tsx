import React, { useState } from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { toast } from 'sonner';

/**
 * Premium Login Page with a focused, minimalist interface.
 */
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser, isLoading, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      if (user.role === 'investor') window.location.href = '/investor';
      else if (user.role === 'admin') window.location.href = '/admin';
      else window.location.href = '/dashboard';
    }
  }, [isAuthenticated, isLoading, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = await authService.login({ email, password });
      console.log('LoginPage User Received:', user);
      setUser(user);
      toast.success(`Welcome back, ${user?.name || 'User'}!`);
      
      // Redirect based on role
      if (user.role === 'admin') window.location.href = '/admin';
      else if (user.role === 'investor') window.location.href = '/investor';
      else window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo / Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900">FounderFlow</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">Welcome back</h1>
            <p className="text-neutral-500 mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <Card className="p-8 shadow-xl shadow-neutral-200/50">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  placeholder="••••••••"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
              >
                Sign in to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Platform Access</p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Connect your account to start managing your startup finances with precision.
              </p>
            </div>
          </Card>

          <p className="text-center text-sm text-neutral-500 mt-8">
            Don't have an account?{' '}
            <a href="/register" className="font-bold text-neutral-900 hover:underline">
              Create account free
            </a>
          </p>
        </motion.div>
      </div>
    </PublicLayout>
  );
};
