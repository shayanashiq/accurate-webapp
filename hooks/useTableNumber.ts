// hooks/useTableNumber.ts
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableStore } from '@/store/tableStore';

export function useTableNumber() {
  const searchParams = useSearchParams();
  const { tableNumber, setTableNumber } = useTableStore();

  useEffect(() => {
    // Get table number from URL
    const tableFromUrl = searchParams.get('table');
    
    if (tableFromUrl && tableFromUrl !== tableNumber) {
      setTableNumber(tableFromUrl);
    }
  }, [searchParams, tableNumber, setTableNumber]);

  return {
    tableNumber,
    setTableNumber,
  };
}