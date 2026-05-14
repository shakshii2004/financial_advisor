import api from '../lib/api';

export interface AnalyticsSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  monthly_burn_rate: number;
  revenue_growth_percentage: number;
  runway_months: number;
  current_balance: number;
}

export interface ChartData {
  month: string;
  revenue: number;
  expense: number;
}

export const analyticsService = {
  async getSummary(startupId: number): Promise<AnalyticsSummary> {
    const response = await api.get('/analytics/summary', { params: { startup_id: startupId } });
    return response.data.data;
  },

  async getChartData(startupId: number, period: string = '6m'): Promise<ChartData[]> {
    const response = await api.get('/analytics/chart', { params: { startup_id: startupId, period } });
    return response.data.data;
  }
};
