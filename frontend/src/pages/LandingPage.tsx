import React from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Globe,
  PieChart,
  CheckCircle2,
} from 'lucide-react';
import { DashboardMockup } from '../components/DashboardMockup';
import { cn } from '../lib/utils';

import { useAuthStore } from '../store/authStore';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const LandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      if (user.role === 'investor') window.location.href = '/investor';
      else if (user.role === 'admin') window.location.href = '/admin';
      else window.location.href = '/dashboard';
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <PublicLayout>
      {/* Navigation - Minimal for Landing */}
      <nav className="h-16 md:h-20 px-6 md:px-8 lg:px-24 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-neutral-100/50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 hidden min-[400px]:block">FounderFlow</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Features</a>
          <a href="#integrations" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Integrations</a>
          <a href="#pricing" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" className="md:hidden" onClick={() => window.location.href = '/login'}>Log in</Button>
          <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => window.location.href = '/login'}>Log in</Button>
          
          <Button size="xs" className="md:hidden" onClick={() => window.location.href = '/register'}>Get Started</Button>
          <Button size="sm" className="hidden md:flex" onClick={() => window.location.href = '/register'}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding pt-24 lg:pt-32 pb-20">
        <div className="section-max-width text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-500 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
            Empowering 5,000+ Founders Worldwide
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-neutral-900 leading-[1.1] tracking-tight"
            {...fadeInUp}
          >
            Manage your startup <br className="hidden sm:block" />
            <span className="text-neutral-400">with precision.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed px-4 md:px-0"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            The all-in-one financial operating system for modern founders. 
            Track burn, manage revenue, and impress investors with professional reporting.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <Button size="lg" className="px-10" onClick={() => window.location.href = '/register'}>
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-10">
              View Demo Dashboard
            </Button>
          </motion.div>

          {/* Abstract Dashboard Preview */}
          <motion.div
            className="pt-20 lg:pt-32 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="relative mx-auto max-w-6xl">
              <div className="absolute -inset-4 bg-neutral-100/50 rounded-[2.5rem] blur-2xl -z-10" />
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-neutral-100">
        <div className="section-max-width px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Total Volume', value: '$250M+' },
              { label: 'Active Startups', value: '5,400' },
              { label: 'Investor Network', value: '850+' },
              { label: 'Avg. Growth', value: '42%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-neutral-400 tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-24 bg-white overflow-hidden border-b border-neutral-100">
        <div className="section-max-width px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                Connectivity
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                Connect your stack. <br />
                <span className="text-neutral-400">Automate your flow.</span>
              </h2>
              <p className="text-lg text-neutral-500 leading-relaxed">
                FounderFlow syncs directly with your bank accounts, accounting software, and payment processors to give you a real-time view of your finances. No more CSV exports.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { name: 'Stripe', status: 'Verified' },
                  { name: 'Plaid', status: 'Direct' },
                  { name: 'QuickBooks', status: 'Sync' },
                  { name: 'Mercury', status: 'Direct' },
                ].map((integ, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 group hover:border-neutral-900 transition-all">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-neutral-900">{integ.name}</span>
                    <span className="ml-auto text-[10px] font-bold text-neutral-400 uppercase">{integ.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
               <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
               <div className="flex flex-col gap-6 -rotate-12 scale-110 opacity-40">
                 {[1, 2, 3].map((row) => (
                   <div key={row} className={cn("flex gap-6", row === 2 && "-translate-x-12")}>
                     {Array.from({ length: 6 }).map((_, i) => (
                       <div key={i} className="w-24 h-24 rounded-3xl bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                         <Globe className="w-8 h-8 text-neutral-300" />
                       </div>
                     ))}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section-padding bg-neutral-50/50">
        <div className="section-max-width space-y-20">
          <div className="max-w-2xl">
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
              {...fadeInUp}
            >
              Built for the next generation of great companies.
            </motion.h2>
            <motion.p 
              className="text-lg text-neutral-500"
              {...fadeInUp}
              transition={{ delay: 0.1 }}
            >
              Powerful tools that help you focus on building your product, not managing spreadsheets.
            </motion.p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: DollarSign,
                title: 'Burn Analysis',
                description: 'Real-time monitoring of your monthly burn and runway projections.',
              },
              {
                icon: TrendingUp,
                title: 'Revenue Streams',
                description: 'Track MRR, ARR, and customer acquisition costs automatically.',
              },
              {
                icon: PieChart,
                title: 'Cap Table Prep',
                description: 'Organize your finances to be investor-ready at a moment\'s notice.',
              },
              {
                icon: Users,
                title: 'Investor CRM',
                description: 'Manage relationships with venture firms and angel investors.',
              },
              {
                icon: ShieldCheck,
                title: 'Audit Ready',
                description: 'Every transaction categorized and backed by source documentation.',
              },
              {
                icon: Globe,
                title: 'Global Payments',
                description: 'Connect with banking partners across 40+ countries effortlessly.',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full p-8 group hover:bg-neutral-900 transition-colors duration-500 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-neutral-900 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-500 group-hover:text-neutral-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section-padding bg-white overflow-hidden">
        <div className="section-max-width">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <motion.h2 className="text-4xl font-bold text-neutral-900" {...fadeInUp}>
                "FounderFlow cut our financial reporting time by 80%."
              </motion.h2>
              <motion.p className="text-lg text-neutral-500" {...fadeInUp} transition={{ delay: 0.1 }}>
                Alex Rivera, Founder & CEO at NexaCloud (Raised $12M Series A)
              </motion.p>
              <motion.div className="flex items-center gap-4" {...fadeInUp} transition={{ delay: 0.2 }}>
                <div className="flex -space-x-3 overflow-hidden">
                  {['AR', 'SK', 'MW'].map((initials, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-neutral-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-neutral-50">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium text-neutral-400">
                  +200 case studies
                </div>
              </motion.div>
            </div>
            <div className="flex-1 w-full lg:w-auto">
              <Card className="p-10 bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <BarChart3 className="w-32 h-32" />
                </div>
                <h4 className="text-2xl font-bold mb-6">Investment-Grade Reporting</h4>
                <ul className="space-y-4">
                  {[
                    'Automatic P&L Statements',
                    'Customizable Board Decks',
                    'Real-time Cashflow Forecasting',
                    'Automated Expense Reconciliation',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-success" />
                      <span className="text-neutral-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="mt-10 w-full">Learn More about Reporting</Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="section-max-width space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.h2 className="text-4xl lg:text-5xl font-bold text-neutral-900" {...fadeInUp}>
              Scalable pricing for startups at any stage.
            </motion.h2>
            <motion.p className="text-lg text-neutral-500" {...fadeInUp} transition={{ delay: 0.1 }}>
              Start for free and upgrade as you grow. No hidden fees, just pure financial clarity.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$0',
                description: 'Perfect for early-stage founders building their first MVP.',
                features: ['1 Startup Profile', 'Basic Burn Tracking', 'Manual Data Entry', 'Community Support'],
                cta: 'Start Free',
                popular: false
              },
              {
                name: 'Founder',
                price: '$49',
                description: 'Advanced tools for scaling startups and fund-raising.',
                features: ['Everything in Starter', 'Automated Bank Sync', 'Investor-Ready Reports', 'Priority Support'],
                cta: 'Go Pro',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'Tailored solutions for high-growth ventures and VC firms.',
                features: ['Unlimited Startups', 'Advanced RBAC', 'API Access', 'Dedicated Account Manager'],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full z-10 shadow-lg">
                    Most Popular
                  </div>
                )}
                <Card className={cn(
                  "h-full p-10 flex flex-col transition-all duration-500",
                  plan.popular ? "border-neutral-900 shadow-2xl scale-105" : "border-neutral-100"
                )}>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-neutral-400 text-sm font-medium">/mo</span>}
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-neutral-600 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? 'primary' : 'outline'} 
                    className="w-full font-bold"
                    onClick={() => window.location.href = '/register'}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="section-padding bg-neutral-50/50">
        <div className="section-max-width text-center">
          <Card className="p-10 md:p-16 lg:p-24 border-none shadow-none bg-neutral-900 text-white text-center space-y-6 md:space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
            <motion.h2 className="text-3xl md:text-5xl lg:text-6xl font-bold relative z-10 text-white" {...fadeInUp}>
              Start your flow today.
            </motion.h2>
            <motion.p className="text-base md:text-xl text-neutral-300 max-w-xl mx-auto relative z-10" {...fadeInUp} transition={{ delay: 0.1 }}>
              Join the elite founders who manage their startups like professional financial institutions.
            </motion.p>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="relative z-10 pt-4">
              <Button size="lg" variant="secondary" className="px-12 w-full sm:w-auto" onClick={() => window.location.href = '/register'}>
                Create Free Account
              </Button>
            </motion.div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="section-max-width px-8 py-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
                </div>
                <span className="text-xl font-bold tracking-tight text-neutral-900">FounderFlow</span>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                The financial command center for founders and investors. Built to scale your vision.
              </p>
            </div>
            {[
              {
                title: 'Product',
                links: ['Dashboard', 'Analytics', 'Reporting', 'Security'],
              },
              {
                title: 'Resources',
                links: ['Documentation', 'Blog', 'Support', 'Guides'],
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Legal', 'Privacy'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-neutral-900 mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-neutral-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
            <p>© 2026 FounderFlow Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-neutral-900">Twitter</a>
              <a href="#" className="hover:text-neutral-900">LinkedIn</a>
              <a href="#" className="hover:text-neutral-900">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
};
