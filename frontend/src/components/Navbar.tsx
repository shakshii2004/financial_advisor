import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  LogOut, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import apiClient from '../lib/api';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setIsSearchOpen(true);
      try {
        const response = await apiClient.get(`/search?q=${searchQuery}`);
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    logout(); // Don't await, let it happen in background
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="h-16 md:h-20 bg-white/90 backdrop-blur-xl border-b border-neutral-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section: Menu & Logo */}
      <div className="flex items-center gap-2 md:gap-6">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 transition-colors lg:hidden active:scale-95"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity lg:hidden">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-neutral-900 rounded-xl flex items-center justify-center shadow-lg shadow-neutral-900/10">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-sm rotate-45" />
          </div>
          <span className="hidden sm:block font-bold text-neutral-900 tracking-tight">FounderFlow</span>
        </Link>
      </div>

      {/* Center Section: Search */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <div className={cn(
          "relative flex items-center gap-3 px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-2xl transition-all group focus-within:bg-white focus-within:border-neutral-300 focus-within:ring-4 focus-within:ring-neutral-900/5"
        )}>
          <Search className="w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
            placeholder="Search startups or analytics..."
            className="bg-transparent border-none outline-none text-sm w-full text-neutral-900 placeholder:text-neutral-400 font-medium"
          />

          <AnimatePresence>
            {isSearchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSearchOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl border border-neutral-100 shadow-2xl z-20 overflow-hidden max-h-[400px] overflow-y-auto"
                >
                  <div className="p-2">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs font-bold text-neutral-400 animate-pulse">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((result, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            if (result.type === 'startup') navigate('/investor/discovery');
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-left group"
                        >
                          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                            {result.name ? result.name[0] : (result.startup?.name?.[0] || 'S')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900">{result.name || result.title}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{result.type}</span>
                              <span className="text-[10px] text-neutral-400">• {result.industry || result.stage}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm font-bold text-neutral-900">No results found</p>
                        <p className="text-xs text-neutral-500 mt-1">Try searching for a different keyword.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-neutral-500 hover:text-neutral-900 lg:hidden active:scale-95 cursor-pointer">
          <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <button className="p-2 text-neutral-500 hover:text-neutral-900 relative active:scale-95 cursor-pointer">
          <Bell className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </button>

        <div className="w-px h-6 bg-neutral-100 mx-1 hidden md:block" />

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 md:pl-1 md:pr-3 md:py-1 rounded-full hover:bg-neutral-50 transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-neutral-900 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-neutral-50 shadow-sm">
              {user?.name?.[0] || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-100 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-neutral-50 bg-neutral-50/50">
                    <p className="text-sm font-bold text-neutral-900 leading-none mb-1">{user?.name}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{user?.role}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-3 p-3 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
