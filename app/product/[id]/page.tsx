// app/(store)/product/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { useProductDetail } from '@/hooks/useProducts';
import ProductDetail from '@/view/products/product-detail';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useProductDetail(id);
  const product = data?.data;
  return (
    <ProductDetail
      product={product}
      isLoading={isLoading}
      error={error}
      success={data?.success}
    />
  );
}
