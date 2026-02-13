// hooks/useCart.ts
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { useMemo } from 'react';

export function useCart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getTotal,
  } = useCartStore();

  const addToCart = (product: Product, quantity: number = 1) => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      productNo: product.no,
      name: product.name,
      price: product.unitPrice,
      quantity,
      image: product.imageUrlThumb,
      maxQuantity: product.availableToSell,
    });
  };

  const cartCount = useMemo(() => getTotalItems(), [items, getTotalItems]);
  const subtotal = useMemo(() => getSubtotal(), [items, getSubtotal]);
  const total = useMemo(() => getTotal(), [items, getTotal]);

  return {
    items,
    cartCount,
    subtotal,
    total,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
  };
}