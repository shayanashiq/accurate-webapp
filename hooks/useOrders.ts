// hooks/useOrders.ts
import { useInfiniteQuery, useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/ReactQueryProvider';
import { Order, OrderDetail } from '@/types';

async function fetchOrders(page: number = 1) {
  const res = await fetch(`/api/accurate/orders?page=${page}&limit=10`);
  if (!res.ok) throw new Error('Failed to fetch orders');
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

export function useOrders() {
  return useInfiniteQuery({
    queryKey: ['orders'],
    queryFn: ({ pageParam = 1 }) => fetchOrders(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.page < lastPage.pagination?.pageCount) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderDetail(id),
    enabled: !!id,
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