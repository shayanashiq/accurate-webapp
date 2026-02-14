// hooks/useOrders.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/ReactQueryProvider';

async function fetchOrders(params: any) {
  const urlParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });

  if (params.customerId) {
    urlParams.append('customerId', params.customerId);
  }

  const res = await fetch(`/api/accurate/orders?${urlParams.toString()}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }

  return res.json();
}

async function fetchOrderDetail(id: string) {
  const res = await fetch(`/api/accurate/orders/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order detail');
  return res.json();
}

async function createOrder(orderData: any) {
  const res = await fetch('/api/accurate/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

export function useOrders(paginationParams: any, filters: any) {
  return useQuery({
    queryKey: [
      'orders',
      paginationParams.page,
      paginationParams.pageSize,
      filters,
    ],
    queryFn: () => fetchOrders({ ...paginationParams, ...filters }),
    placeholderData: (previousData) => previousData, // Smooth pagination
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderDetail(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
