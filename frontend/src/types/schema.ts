// Type definitions for the frontend - v3
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: 'founder' | 'investor' | 'admin';
  created_at: string;
  updated_at: string;
}

export type Startup = {
  id: number;
  user_id: number;
  name: string;
  industry: string;
  stage: 'Idea' | 'Prototype' | 'MVP' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Growth';
  website?: string;
  description?: string;
  logo_url?: string;
  currency?: 'USD' | 'INR';
  // Financial & Performance Metrics
  valuation?: number;
  traction?: string;
  funding_progress?: number;
  funding_requests?: any[];
  funding?: number;
  created_at: string;
  updated_at: string;
};

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: 'founder' | 'investor';
}

export interface Transaction {
  id: number;
  startup_id: number;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  date: string;
  description?: string;
  status: string;
  currency?: 'USD' | 'INR';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  startup_id: number;
  category: string;
  amount: number;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Revenue {
  id: number;
  startup_id: number;
  source: string;
  amount: number;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FundingRequest {
  id: number;
  startup_id: number;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardStats {
  total_startups: number;
  total_users: number;
  total_funding_requested: number;
  recent_activity: Array<{ date: string; count: number }>;
}
