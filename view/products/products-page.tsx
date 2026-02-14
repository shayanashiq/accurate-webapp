// view/products/products-page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/view/products/productGrid';
import { ProductSearch } from '@/view/products/product-search';
import { Pagination } from '@/components/ui/pagination';
import { useState } from 'react';
import Maxwidth from '@/components/Maxwidth';
import { usePagination } from '@/hooks/usePagination';

export function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  // Use pagination hook
  const { page, pageSize, setPage, setPageSize, totalPages, paginationParams } =
    usePagination({
      initialPageSize: 12,
    });

  const { data, isLoading } = useProducts(search, paginationParams);

  const products = data?.products || [];
  const totalItems = data?.count || 0;

  return (
    <Maxwidth className="py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of {totalItems} high-quality products
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-96">
          <ProductSearch />
        </div>
        {/* Add more filters here if needed */}
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} isLoading={isLoading} />

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
        pageSizeOptions={[12, 24, 48, 96]}
        // Custom styling
        className="mt-8"
        activeButtonClassName="bg-primary text-primary-foreground"
      />
    </Maxwidth>
  );
}
