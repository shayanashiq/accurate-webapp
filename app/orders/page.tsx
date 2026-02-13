// app/(store)/orders/page.tsx
'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderList } from '@/view/orders/order-list';

export default function OrdersPage() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useOrders();

  const orders = data?.pages.flatMap((page) => page.data) || [];

  return (
    <OrderList
      orders={orders}
      isLoading={isLoading}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
    />
  );
}
