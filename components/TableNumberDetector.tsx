// components/TableNumberDetector.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableStore } from '@/store/tableStore';

export function TableNumberDetector() {
  const searchParams = useSearchParams();
  const { setTableNumber } = useTableStore();

  useEffect(() => {
    // Check for table number in URL
    const tableFromUrl = searchParams.get('table');
    
    if (tableFromUrl) {
      console.log('📍 Table number detected from URL:', tableFromUrl);
      setTableNumber(tableFromUrl);
    }
  }, [searchParams, setTableNumber]);

  return null;
}