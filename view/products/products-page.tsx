// view/products/products-page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/view/products/productGrid';
import { ProductSearch } from '@/view/products/product-search';
import { Pagination } from '@/components/ui/pagination';
import { useEffect, useMemo, useState } from 'react';
import Maxwidth from '@/components/Maxwidth';
import { usePagination } from '@/hooks/usePagination';
import { useProductImages } from '@/hooks/useProductImages';

export function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const [productsWithImages, setProductsWithImages] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  // Use pagination hook
  const { page, pageSize, setPage, setPageSize, totalPages, paginationParams } =
    usePagination({
      initialPageSize: 12,
      totalItems: totalItems,
    });

  const { data, isLoading: productsLoading } = useProducts(
    search,
    paginationParams
  );

  useEffect(() => {
    const totalItems = data?.totalCount || 0;
    setTotalItems(totalItems);
  }, [data?.totalCount]);

  const products = data?.products || [];
  // ✅ totalCount use karo
  // const currentPageItems = data?.count || 0; // Optional: for info

  // Get product IDs from current page
  const productIds = useMemo(
    () => products.map((p: any) => p.id).filter(Boolean),
    [products]
  );

  // API 2: Fetch images for these products (no pagination)
  const { data: imagesData, isLoading: imagesLoading } =
    useProductImages(productIds);
  console.log(imagesData, 'imagesData');

  // ✅ Simple merge - bas id compare karo aur image add karo
  useEffect(() => {
    if (!products.length) return;

    if (imagesData?.length) {
      // Simple object banao id ke saath
      const imageMap: any = {};
      imagesData.forEach((item: any) => {
        imageMap[item.productId] = item.image; // Sirf image store karo
      });

      // Products mein image add karo
      const updated = products.map((product: any) => ({
        ...product,
        image: imageMap[product.id] || null, // ✅ id compare karke image add ki
      }));

      setProductsWithImages(updated);
    } else {
      setProductsWithImages(products);
    }
  }, [products, imagesData]);

  console.log(productsWithImages, 'productsWithImages');
  const isLoading = productsLoading || imagesLoading;

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
      {/* <ProductGrid products={products} isLoading={isLoading} /> */}
      <ProductGrid products={productsWithImages} isLoading={isLoading} />

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
