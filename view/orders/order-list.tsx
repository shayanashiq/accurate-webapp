// view/orders/OrderList.tsx
'use client';

import { Order } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Eye, Download, Plus } from 'lucide-react';
import Link from 'next/link';
import Maxwidth from '@/components/Maxwidth';

interface OrderListProps {
  orders: Order[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function OrderList({
  orders,
  isLoading,
  onLoadMore,
  hasMore,
}: OrderListProps) {
  if (isLoading) {
    return (
      <Maxwidth className="space-y-4 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </Maxwidth>
    );
  }

  if (orders.length === 0) {
    return (
      <Maxwidth className="my-8">
        <Card >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground">
              When you place an order, it will appear here.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </Maxwidth>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Maxwidth className="space-y-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage your orders</p>
        </div>
        <Button asChild>
          <Link href="/products">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Order #{order.number}</CardTitle>
                <CardDescription>
                  Placed on {formatDate(order.transDate)}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status || 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Customer</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer?.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-sm text-muted-foreground">
                  ${order.total?.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/orders/${order.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Invoice
            </Button>
          </CardFooter>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={onLoadMore} variant="outline">
            Load More Orders
          </Button>
        </div>
      )}
    </Maxwidth>
  );
}
