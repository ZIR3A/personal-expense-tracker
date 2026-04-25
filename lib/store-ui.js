import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isAddModalOpen: false,
  isExportModalOpen: false,
  isFilterOpen: false,
  editingTransaction: null,
  isLoading: false,
  toasts: [],

  openAddModal: () => set({ isAddModalOpen: true, editingTransaction: null }),
  closeAddModal: () => set({ isAddModalOpen: false, editingTransaction: null }),
  
  openEditModal: (transaction) => set({ isAddModalOpen: true, editingTransaction: transaction }),
  closeEditModal: () => set({ isAddModalOpen: false, editingTransaction: null }),
  
  openExportModal: () => set({ isExportModalOpen: true }),
  closeExportModal: () => set({ isExportModalOpen: false }),
  
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  addToast: (toast) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 3000);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  }))
}));
