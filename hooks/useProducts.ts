// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';

interface PaginationParams {
  page: number;
  pageSize: number;
  offset?: number;
}

async function fetchProducts(params: PaginationParams, search?: string) {
  const urlParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });

  if (search) {
    urlParams.append('search', search);
  }

  const res = await fetch(`/api/accurate/products?${urlParams.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export function useProducts(
  searchTerm: string = '',
  paginationParams: PaginationParams
) {
  const debouncedSearch = useDebounce(searchTerm, 500);

  return useQuery({
    queryKey: [
      'products',
      debouncedSearch,
      paginationParams.page,
      paginationParams.pageSize,
    ],
    queryFn: () => fetchProducts(paginationParams, debouncedSearch),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

async function fetchProductDetail(id: string) {
  const res = await fetch(`/api/accurate/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product detail');
  return res.json();
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}