import api from '../lib/api';
import type { Startup } from '../types/schema';

export interface Investment {
  id: number;
  startup_id: number;
  investor_id: number;
  amount: number | null;
  equity_percentage: number | null;
  status: string;
  created_at: string;
}

export const investmentService = {
  /**
   * For Founders: Get all investors for a specific startup
   */
  async getInvestors(startupId: number): Promise<any[]> {
    const response = await api.get('/investments/investors', { params: { startup_id: startupId } });
    return response.data.data;
  },

  /**
   * For Investors: Get portfolio of invested startups
   */
  async getPortfolio(): Promise<Startup[]> {
    const response = await api.get('/investments/portfolio');
    return response.data.data;
  },

  /**
   * For Founders: Add an investor to a startup
   */
  async addInvestment(data: { startup_id: number; investor_email: string; amount?: number; equity_percentage?: number }): Promise<Investment> {
    const response = await api.post('/investments/add', data);
    return response.data.data;
  }
};
