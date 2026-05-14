import api from '../lib/api';
import type { Transaction } from '../types/schema';

/**
 * Transaction Service
 * 
 * Manages financial transactions (Revenue and Expenses).
 */
export const transactionService = {
  /**
   * Fetches transactions. Optional filtering by startup_id and type.
   */
  async getAll(params?: { startup_id?: number; type?: 'revenue' | 'expense' }): Promise<Transaction[]> {
    const response = await api.get('/transactions', { params });
    return response.data.data;
  },

  /**
   * Records a new transaction.
   */
  async create(data: Partial<Transaction>): Promise<Transaction> {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  /**
   * Deletes a transaction.
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
