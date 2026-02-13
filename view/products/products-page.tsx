// view/products/products-page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/view/products/productGrid';
import { ProductSearch } from '@/view/products/product-search';
import { Pagination } from '@/components/ui/pagination';
import { useState } from 'react';
import Maxwidth from '@/components/Maxwidth';

export function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const [page, setPage] = useState(1);
  
  const { data, isLoading, fetchNextPage, hasNextPage } = useProducts(search);
  
  // Flatten all products from all pages
  const products = data?.pages.flatMap(page => page.products) || [];
  
  // For demo purposes, we'll use mock pagination
  const totalPages = data?.pages[0]?.pagination?.pageCount || 1;
  const currentPageData = data?.pages[page - 1];
  const currentPageProducts = currentPageData?.products || [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Fetch more if needed
    if (newPage > (data?.pages.length || 0)) {
      fetchNextPage();
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Maxwidth className="py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of high-quality products
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
      <ProductGrid 
        products={currentPageProducts} 
        isLoading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Maxwidth>
  );
}