// view/cart/CartDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/view/cart/cart-item';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { OrderDialog } from '@/components/OrderDialogue';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, subtotal, total, clearCart } = useCart();
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isSnapReady, setIsSnapReady] = useState(false);
  const router = useRouter();

  // Check if Snap is loaded
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait

    const checkSnap = setInterval(() => {
      attempts++;
      
      if (window.snap) {
        console.log('✅ Snap is ready');
        setIsSnapReady(true);
        clearInterval(checkSnap);
      } else if (attempts >= maxAttempts) {
        console.error('❌ Snap failed to load after 5 seconds');
        clearInterval(checkSnap);
      }
    }, 100);

    return () => clearInterval(checkSnap);
  }, []);

  // Convert to Rupiah
  const totalInIDR = Math.round(total * 15000); // Adjust conversion rate

  const handlePlaceOrder = async (customerName: string) => {
    if (!isSnapReady || !window.snap) {
      toast.error('Payment system is still loading. Please wait a moment.');
      console.error('❌ Snap not ready:', { isSnapReady, snap: window.snap });
      return;
    }

    const loadingToast = toast.loading('Creating order...');

    try {
      const orderId = `ORDER-${Date.now()}`;

      console.log('📦 Creating transaction:', {
        orderId,
        customerName,
        totalInIDR,
        itemsCount: items.length,
      });

      // Create transaction
      const response = await fetch('/api/payment/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerName,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: Math.round(item.price * 15000),
            quantity: item.quantity,
          })),
          grossAmount: totalInIDR,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('📡 Transaction response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to create transaction');
      }

      if (!data.token) {
        throw new Error('No payment token received');
      }

      toast.dismiss(loadingToast);

      // Close dialogs before opening payment
      setIsOrderDialogOpen(false);
      onOpenChange(false);

      console.log('💳 Opening Midtrans Snap with token:', data.token);

      // Small delay to ensure dialogs are closed
      setTimeout(() => {
        if (window.snap) {
          window.snap.pay(data.token, {
            onSuccess: function (result: any) {
              console.log('✅ Payment success:', result);
              toast.success('Payment successful!');
              clearCart();
              router.push(`/payment/success?order_id=${orderId}`);
            },
            onPending: function (result: any) {
              console.log('⏳ Payment pending:', result);
              toast.loading('Payment is being processed...');
              router.push(`/payment/pending?order_id=${orderId}`);
            },
            onError: function (result: any) {
              console.error('❌ Payment error:', result);
              toast.error('Payment failed. Please try again.');
            },
            onClose: function () {
              console.log('🚪 Payment popup closed');
              toast('Payment cancelled', { icon: '❌' });
            },
          });
        }
      }, 300);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('❌ Order placement failed:', error);
      toast.error(error.message || 'Failed to process order');
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col sm:max-w-lg py-10">
          <SheetHeader className="px-1">
            <SheetTitle className="flex items-center justify-between">
              <span>Shopping Cart</span>
              <span className="text-sm font-normal text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Looks like you haven&apos;t added anything to your cart yet.
                </p>
              </div>
              <Button onClick={() => onOpenChange(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rp{totalInIDR.toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>Rp{totalInIDR.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsOrderDialogOpen(true)}
                    disabled={!isSnapReady}
                  >
                    {isSnapReady ? 'Place Order' : 'Loading payment system...'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <OrderDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        onConfirm={handlePlaceOrder}
        totalAmount={totalInIDR}
      />
    </>
  );
}