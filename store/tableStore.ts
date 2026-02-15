// store/tableStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TableStore {
  tableNumber: string | null;
  setTableNumber: (tableNumber: string) => void;
  clearTableNumber: () => void;
}

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      tableNumber: null,
      setTableNumber: (tableNumber) => set({ tableNumber }),
      clearTableNumber: () => set({ tableNumber: null }),
    }),
    {
      name: 'table-storage',
    }
  )
);