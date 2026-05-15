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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New Interest', message: 'An investor from Sequoia showed interest in your startup.', time: '2m ago', unread: true },
    { id: 2, title: 'Revenue Update', message: 'Your weekly revenue report for May is now available.', time: '1h ago', unread: true },
    { id: 3, title: 'System', message: 'Welcome to FounderFlow! Your dashboard is ready.', time: '1d ago', unread: false },
  ];

  const handleLogout = () => {
    logout(); // Don't await, let it happen in background
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="h-16 md:h-20 bg-white/90 backdrop-blur-xl border-b border-neutral-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-0 top-0 z-50 bg-white px-4 py-2 border-b border-neutral-200 lg:hidden min-h-screen"
          >
            <div className="flex items-center gap-4 h-12 mb-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search startups or analytics..."
                  className="bg-transparent border-none outline-none text-sm w-full text-neutral-900 font-medium"
                />
              </div>
              <button 
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-sm font-bold text-neutral-500 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Mobile Results */}
            <div className="space-y-2">
              {isSearching ? (
                <div className="p-4 text-center text-xs font-bold text-neutral-400 animate-pulse">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      setSearchQuery('');
                      if (result.type === 'startup') navigate('/investor/discovery');
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 rounded-2xl transition-colors text-left bg-neutral-50/30 border border-neutral-100 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {result.name ? result.name[0] : (result.startup?.name?.[0] || 'S')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">{result.name || result.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded">{result.type}</span>
                        <span className="text-[10px] text-neutral-400 truncate">• {result.industry || result.stage}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : searchQuery.length >= 2 && (
                <div className="p-12 text-center">
                  <p className="text-sm font-bold text-neutral-900">No results found</p>
                  <p className="text-xs text-neutral-500 mt-1">Try searching for something else.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Section: Menu & Logo */}
      <div className="flex items-center gap-2 md:gap-6">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 transition-colors lg:hidden active:scale-95 cursor-pointer"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity lg:hidden cursor-pointer">
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
                          className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-left group cursor-pointer"
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
        <button 
          onClick={() => setIsMobileSearchOpen(true)}
          className="p-2 text-neutral-500 hover:text-neutral-900 lg:hidden active:scale-95 cursor-pointer"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-neutral-500 hover:text-neutral-900 relative active:scale-95 cursor-pointer"
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-neutral-100 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/50">
                    <h3 className="text-sm font-bold text-neutral-900">Notifications</h3>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                      {notifications.filter(n => n.unread).length} New
                    </span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-neutral-50 hover:bg-neutral-50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start gap-3">
                          <div className={cn(
                            "w-2 h-2 mt-1.5 rounded-full shrink-0",
                            n.unread ? "bg-indigo-600 shadow-sm shadow-indigo-200" : "bg-transparent"
                          )} />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-neutral-900 leading-tight mb-0.5">{n.title}</p>
                            <p className="text-xs text-neutral-500 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-neutral-400 mt-2 font-medium">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 text-xs font-bold text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all border-t border-neutral-50 cursor-pointer">
                    View all notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
