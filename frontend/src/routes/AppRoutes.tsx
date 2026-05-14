import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { FounderDashboard } from '../pages/FounderDashboard';
import { StartupsPage } from '../pages/StartupsPage';
import { ExpensesPage } from '../pages/ExpensesPage';
import { RevenuePage } from '../pages/RevenuePage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { FounderInterestPage } from '../pages/FounderInterestPage';
import { InvestorDashboard } from '../pages/InvestorDashboard';
import { InvestorDiscoveryPage } from '../pages/InvestorDiscoveryPage';
import { InvestorFundingPage } from '../pages/InvestorFundingPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { SettingsPage } from '../pages/SettingsPage';
import { HelpCenterPage } from '../pages/HelpCenterPage';
import { useAuthStore } from '../store/authStore';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

/**
 * Page Transition Wrapper to add consistent animations between routes.
 */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only initialize if we don't have a user and we aren't already loading
    if (!isAuthenticated && isLoading) {
      initialize();
    }
  }, [initialize, isAuthenticated, isLoading]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

        {/* Founder Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole={['founder']}>
              <DashboardLayout>
                <PageTransition>
                  <FounderDashboard />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/startups"
          element={
            <ProtectedRoute requiredRole={['founder']}>
              <DashboardLayout>
                <PageTransition>
                  <StartupsPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute requiredRole={['founder']}>
              <DashboardLayout>
                <PageTransition>
                  <ExpensesPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <ProtectedRoute requiredRole={['founder']}>
              <DashboardLayout>
                <PageTransition>
                  <RevenuePage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRole={['founder', 'investor', 'admin']}>
              <DashboardLayout>
                <PageTransition>
                  <AnalyticsPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor-interests"
          element={
            <ProtectedRoute requiredRole={['founder']}>
              <DashboardLayout>
                <PageTransition>
                  <FounderInterestPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRole={['founder', 'investor', 'admin']}>
              <DashboardLayout>
                <PageTransition>
                  <SettingsPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute requiredRole={['founder', 'investor', 'admin']}>
              <DashboardLayout>
                <PageTransition>
                  <HelpCenterPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Investor Protected Routes */}
        <Route
          path="/investor"
          element={
            <ProtectedRoute requiredRole={['investor']}>
              <DashboardLayout>
                <PageTransition>
                  <InvestorDashboard />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/discovery"
          element={
            <ProtectedRoute requiredRole={['investor']}>
              <DashboardLayout>
                <PageTransition>
                  <InvestorDiscoveryPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/funding"
          element={
            <ProtectedRoute requiredRole={['investor']}>
              <DashboardLayout>
                <PageTransition>
                  <InvestorFundingPage />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <DashboardLayout>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};
