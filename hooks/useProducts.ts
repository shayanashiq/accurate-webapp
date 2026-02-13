// hooks/useProducts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'; 
import { useDebounce } from '@/hooks/useDebounce';

async function fetchProducts(page: number = 1, search?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '5',
  });

  if (search) {
    params.append('search', search);
  }

  const res = await fetch(`/api/accurate/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

async function fetchProductDetail(id: string) {
  const res = await fetch(`/api/accurate/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product detail');
  return res.json();
}

export function useProducts(searchTerm: string = '') {
  const debouncedSearch = useDebounce(searchTerm, 500);

  return useInfiniteQuery({
    queryKey: ['products', debouncedSearch],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam, debouncedSearch),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.page < lastPage.pagination?.pageCount) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
  });
}