import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardShell } from '../components/DashboardShell';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Search, 
  ChevronDown, 
  MessageCircle, 
  Mail, 
  LifeBuoy 
} from 'lucide-react';
import { cn } from '../lib/utils';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: "How do I register a new startup?",
        a: "Navigate to the 'My Startups' tab from the sidebar and click the 'Register Startup' button. Fill in your company details, select your base currency, and you're good to go!"
      },
      {
        q: "Can I manage multiple startups?",
        a: "Founders are currently limited to managing one primary startup profile per account to ensure data accuracy. If you run a venture studio or need multiple profiles, please contact support for an enterprise upgrade."
      }
    ]
  },
  {
    category: 'Financial Tracking',
    questions: [
      {
        q: "How is my runway calculated?",
        a: "Your runway is calculated by dividing your current cash balance by your average monthly burn rate. If you don't have historical data, we use your expenses from the current month to project your burn rate."
      },
      {
        q: "Can I change my base currency?",
        a: "You can set your base currency (USD or INR) when creating your startup profile. Once set, it cannot be changed automatically as it affects historical ledger entries. Please contact support if you need a full currency migration."
      },
      {
        q: "How do I export my financial reports?",
        a: "Currently, you can view all insights on the Analytics page. PDF and CSV exports are scheduled for our next major release."
      }
    ]
  },
  {
    category: 'Account & Security',
    questions: [
      {
        q: "Is my financial data secure?",
        a: "Absolutely. FounderFlow uses enterprise-grade encryption. We never share your individual ledger data with third parties or investors without your explicit opt-in consent."
      },
      {
        q: "How do I reset my password?",
        a: "You can update your password from the Settings page. If you're locked out of your account, use the 'Forgot Password' link on the login screen."
      }
    ]
  }
];

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <DashboardShell
      title="Help Center"
      subtitle="Find answers to common questions or reach out to our team."
    >
      {/* Search Header */}
      <Card className="mb-12 border-none bg-neutral-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-12 relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <LifeBuoy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">How can we help you today?</h2>
          <div className="relative w-full max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for articles, guides, or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-xl transition-all"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-10">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIdx) => (
              <div key={catIdx}>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((q, qIdx) => {
                    const id = `${catIdx}-${qIdx}`;
                    const isOpen = openIndex === id;
                    return (
                      <Card 
                        key={qIdx} 
                        className={cn(
                          "transition-all duration-200 cursor-pointer hover:border-neutral-300",
                          isOpen ? "border-neutral-900 shadow-md" : ""
                        )}
                        onClick={() => toggleQuestion(id)}
                      >
                        <CardContent className="p-0">
                          <div className="p-5 flex items-center justify-between gap-4">
                            <p className={cn(
                              "font-semibold text-sm",
                              isOpen ? "text-neutral-900" : "text-neutral-700"
                            )}>{q.q}</p>
                            <ChevronDown className={cn(
                              "w-5 h-5 text-neutral-400 transition-transform duration-200 flex-shrink-0",
                              isOpen ? "rotate-180 text-neutral-900" : ""
                            )} />
                          </div>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-5 pb-5 text-sm text-neutral-500 leading-relaxed border-t border-neutral-50 pt-4">
                                  {q.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No results found for "{searchQuery}".</p>
            </div>
          )}
        </div>

        {/* Contact Support Sidebar */}
        <div className="space-y-6">
          <Card className="bg-indigo-50 border-indigo-100">
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-indigo-900 mb-2">Still need help?</h3>
              <p className="text-sm text-indigo-700/80 mb-6 leading-relaxed">
                Can't find the answer you're looking for? Our support team is here to help you.
              </p>
              <Button 
                onClick={() => window.location.href = 'mailto:support@founderflow.com'} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-bold text-neutral-900 mb-4">Support Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Mon - Fri</span>
                  <span className="font-medium text-neutral-900">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Sat - Sun</span>
                  <span className="font-medium text-neutral-900">Closed</span>
                </div>
                <div className="pt-4 mt-4 border-t border-neutral-50 flex items-center gap-2 text-xs text-neutral-400">
                  <Mail className="w-4 h-4" />
                  Expected response time: ~24 hours
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};
