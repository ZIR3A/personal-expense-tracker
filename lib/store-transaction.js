import { create } from 'zustand';
import { transactionAPI, statsAPI, budgetAPI } from './api';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  stats: null,
  budgets: {},
  filters: {
    startDate: null,
    endDate: null,
    type: null,
    category: null,
    search: ''
  },
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = {};
      
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      
      const response = await transactionAPI.list(params);
      set({ transactions: response.data.data.transactions, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error || 'Failed to fetch transactions' });
    }
  },

  fetchStats: async () => {
    try {
      const response = await statsAPI.get();
      set({ stats: response.data.data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  addTransaction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transactionAPI.create(data);
      const newTransaction = response.data.data.transaction;
      
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        isLoading: false
      }));
      
      get().fetchStats();
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error || 'Failed to add transaction' });
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateTransaction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transactionAPI.update(id, data);
      const updated = response.data.data.transaction;
      
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? updated : t)),
        isLoading: false
      }));
      
      get().fetchStats();
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error || 'Failed to update transaction' });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await transactionAPI.delete(id);
      
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false
      }));
      
      get().fetchStats();
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error || 'Failed to delete transaction' });
      return { success: false, error: error.response?.data?.error };
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().fetchTransactions();
  },

  clearFilters: () => {
    set({
      filters: {
        startDate: null,
        endDate: null,
        type: null,
        category: null,
        search: ''
      }
    });
    get().fetchTransactions();
  },

  fetchBudgets: async () => {
    try {
      const response = await budgetAPI.get();
      set({ budgets: response.data.data.budgets });
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    }
  },

  updateBudgets: async (budgets) => {
    try {
      await budgetAPI.update(budgets);
      set({ budgets });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  }
}));