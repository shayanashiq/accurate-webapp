// hooks/useOrders.ts (add this mutation)
import { queryClient } from '@/components/ReactQueryProvider';
import { useMutation } from '@tanstack/react-query';

interface OrderItem {
  itemNo: string;
  quantity: number;
  unitPrice?: number;
  discount?: number;
  detailNotes?: string;
}

interface CreateOrderData {
  customerNo: string;
  transDate?: string;
  items: OrderItem[];
  description?: string;
  detailMemo?: string;
  branchNo?: string;
  warehouseNo?: string;
}

async function createOrder(orderData: CreateOrderData) {
  const res = await fetch('/api/accurate/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create order');
  }
  
  return res.json();
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      console.log('✅ Order created:', data.data);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}