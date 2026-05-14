import React from 'react';
import { motion } from 'framer-motion';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/authStore';
import { settingsService } from '../services/settingsService';
import { toast } from 'sonner';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard,
  Mail,
  Smartphone
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const [activeSection, setActiveSection] = React.useState('profile');
  const [name, setName] = React.useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await settingsService.updateProfile({ name });
      toast.success('Profile updated successfully! Refresh to see changes globally.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await settingsService.updatePassword({ 
        current_password: currentPassword, 
        new_password: newPassword, 
        new_password_confirmation: confirmPassword 
      });
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Settings"
      subtitle="Manage your personal profile, security preferences, and account details."
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeSection === section.id 
                    ? "bg-neutral-900 text-white shadow-lg" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <Card>
                  <CardHeader title="Public Profile" subtitle="Your basic information visible across the platform." />
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-neutral-50">
                      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <User className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline">Change Avatar</Button>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Recommended: 400x400px</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <Input 
                        label="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                      <Input label="Job Title" placeholder="CEO & Founder" />
                    </div>
                    <Input label="Email Address" defaultValue={user?.email} disabled />
                    <Button className="px-8" onClick={handleProfileUpdate} isLoading={loading}>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title="Social Links" />
                  <CardContent className="p-8 space-y-6">
                    <Input label="LinkedIn" placeholder="https://linkedin.com/in/username" />
                    <Input label="Twitter / X" placeholder="https://twitter.com/username" />
                    <Button variant="outline">Update Socials</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-8">
                <Card>
                  <CardHeader title="Update Password" subtitle="Ensure your account is using a long, random password." />
                  <CardContent className="p-8 space-y-6">
                    <Input 
                      label="Current Password" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <Input 
                        label="New Password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Input 
                        label="Confirm Password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handlePasswordUpdate} isLoading={loading}>Update Password</Button>
                  </CardContent>
                </Card>

                <Card className="border-red-100 bg-red-50/20">
                  <CardHeader title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account." />
                  <CardContent className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-red-600">
                      <Shield className="w-6 h-6" />
                      <div>
                        <p className="text-sm font-bold">2FA is currently disabled</p>
                        <p className="text-xs opacity-70">Highly recommended for all founders.</p>
                      </div>
                    </div>
                    <Button size="sm">Enable 2FA</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'notifications' && (
              <Card>
                <CardHeader title="Email Preferences" subtitle="Control which emails you receive from FounderFlow." />
                <CardContent className="p-8 space-y-6">
                  {[
                    { label: 'Weekly Performance Report', desc: 'Summary of your startup analytics and runway.', icon: Mail },
                    { label: 'Security Alerts', desc: 'Critical alerts about login attempts and password changes.', icon: Shield },
                    { label: 'Investment Interest', desc: 'Instant notifications when an investor views your profile.', icon: Smartphone },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                          <pref.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{pref.label}</p>
                          <p className="text-xs text-neutral-500">{pref.desc}</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" 
                      />
                    </div>
                  ))}
                  <div className="pt-4 border-t border-neutral-50">
                    <Button>Update Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'billing' && (
              <Card>
                <CardHeader title="Current Plan" subtitle="You are currently on the Pro plan." />
                <CardContent className="p-8 space-y-6">
                  <div className="p-6 bg-neutral-900 rounded-2xl text-white">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Monthly Subscription</p>
                        <p className="text-3xl font-bold">$49.00 / month</p>
                      </div>
                      <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase">Active</span>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full">Manage Subscription</Button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Payment Method</p>
                    <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-neutral-400" />
                        <span className="text-sm font-bold">Visa ending in 4242</span>
                      </div>
                      <button className="text-xs font-bold text-neutral-900 hover:underline">Edit</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
};
