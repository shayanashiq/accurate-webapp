// view/orders/OrderList.tsx
'use client';

import { useState } from 'react';
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
import { Eye, Download, Plus, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import Maxwidth from '@/components/Maxwidth';
import { useOrders } from '@/hooks/useOrders'; 
import { usePagination } from '@/hooks/usePagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';

export function OrderList() {
  // Filter state
  const [filters, setFilters] = useState({
    customerId: '',
    status: '',
  });

  // Pagination hook - saara logic yahan handle ho ga
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    totalPages,
    paginationParams,
    startIndex,
    endIndex,
  } = usePagination({
    initialPageSize: 10,
  });

  // Fetch orders with pagination and filters
  const { data, isLoading } = useOrders(paginationParams, filters);

  const orders = data?.data || [];
  const totalItems = data?.pagination?.rowCount || 0;

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ customerId: '', status: '' });
    setPage(1);
  };

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Maxwidth className="space-y-4 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </Maxwidth>
    );
  }

  return (
    <Maxwidth className="py-8 space-y-8">
      {/* Header */}
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

      {/* Filters Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Customer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer ID"
                  value={filters.customerId}
                  onChange={(e) =>
                    handleFilterChange('customerId', e.target.value)
                  }
                  className="pl-8"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              {(filters.customerId || filters.status) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      {totalItems > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{' '}
          {totalItems} orders
        </p>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <Card>
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
      ) : (
        <>
          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order:any) => (
              <Card
                key={order.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.number}
                      </CardTitle>
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
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Customer
                      </p>
                      <p className="text-sm">{order.customer?.name || 'N/A'}</p>
                      {order.customer?.customerNo && (
                        <p className="text-xs text-muted-foreground">
                          ID: {order.customer.customerNo}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-lg font-semibold">
                        ${order.total?.toFixed(2) || '0.00'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Items
                      </p>
                      <p className="text-sm">
                        {order.items?.length || 0} items
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
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={totalItems}
              showPageSize={true}
              showPageInfo={true}
              showFirstLast={true}
              pageSizeOptions={[10, 25, 50, 100]}
              className="mt-8"
            />
          )}
        </>
      )}
    </Maxwidth>
  );
}
