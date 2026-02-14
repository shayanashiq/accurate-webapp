// view/products/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const isOutOfStock = product.availableToSell === 0;
console.log(product.image, "product.image")
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:shadow-lg",
      variant === 'compact' && "flex flex-col"
    )}>
      <Link href={`/product-detail?id=${product.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {isOutOfStock && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            Out of Stock
          </Badge>
        )}

        {product.unitPrice > 100 && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            Premium
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{product.itemType}</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-lg font-bold">
            ${product.unitPrice.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">
            per {product.unit1Name}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button size="sm" variant="ghost" className="px-3" asChild>
            <Link href={`/product-detail?id=${product.id}`} onClick={(e) => e.stopPropagation()}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}