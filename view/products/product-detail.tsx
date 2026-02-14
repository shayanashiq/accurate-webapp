// view/products/product-detail.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useProductDetail } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') as string;
  const { data, isLoading, error } = useProductDetail(id);
  const product = data?.data;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="mt-2 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button className="mt-8" asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage =
    images[selectedImage]?.thumbnailPath || product.imageUrlThumb;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      productNo: product.no,
      name: product.name,
      price: product.unitPrice,
      quantity,
      image: mainImage,
      maxQuantity: product.availableToSell,
    });
  };

  return (
    <div className="py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/" className="hover:text-primary">
          Products
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">
                  No image available
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  {image.thumbnailPath && (
                    <Image
                      src={image.thumbnailPath}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="20vw"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">SKU: {product.no}</p>
          </div>

          {/* Price & Stock */}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold">
              ${product.unitPrice.toFixed(2)}
            </span>
            <span className="text-muted-foreground">
              per {product.unit1Name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {product.availableToSell && product.availableToSell > 0 ? (
              <>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  In Stock
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {product.availableToSell} available
                </span>
              </>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <Separator />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.availableToSell}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="h-10 w-20 rounded-none text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        product.availableToSell || quantity,
                        quantity + 1
                      )
                    )
                  }
                  disabled={quantity >= (product.availableToSell || Infinity)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={
                !product.availableToSell || product.availableToSell === 0
              }
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>2 year warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>30-day returns</span>
            </div>
          </div>

          <Separator />

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-muted-foreground">
                {product.notes || 'No description available.'}
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="font-medium">Item Type:</dt>
                <dd className="text-muted-foreground">
                  {product.itemTypeName || product.itemType}
                </dd>

                <dt className="font-medium">Category:</dt>
                <dd className="text-muted-foreground">
                  {product.itemCategory?.name || 'Uncategorized'}
                </dd>

                <dt className="font-medium">Weight:</dt>
                <dd className="text-muted-foreground">
                  {product.weight > 0 ? `${product.weight} kg` : 'N/A'}
                </dd>

                <dt className="font-medium">Dimensions:</dt>
                <dd className="text-muted-foreground">
                  {product.dimensions.width > 0
                    ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
                    : 'N/A'}
                </dd>

                <dt className="font-medium">UPC:</dt>
                <dd className="text-muted-foreground">
                  {product.upcNo || 'N/A'}
                </dd>
              </dl>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Free shipping on all orders over $50. Orders typically ship
                  within 1-2 business days.
                </p>
                <p>
                  Standard delivery: 3-5 business days
                  <br />
                  Express delivery: 1-2 business days
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Warehouse Stock */}
          {product.warehouses && product.warehouses.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold">Available in Warehouses</h3>
                <div className="space-y-2">
                  {product.warehouses.map((warehouse: any) => (
                    <div
                      key={warehouse.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {warehouse.name}
                      </span>
                      <span className="font-medium">
                        {warehouse.balance} units
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="py-8 space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
