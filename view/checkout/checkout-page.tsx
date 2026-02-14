// view/checkout/checkout-page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Maxwidth from '@/components/Maxwidth';
import toast from 'react-hot-toast';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const getJakartaDate = () => {
  const now = new Date();
  const jakartaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  );
  const day = String(jakartaTime.getDate()).padStart(2, '0');
  const month = String(jakartaTime.getMonth() + 1).padStart(2, '0');
  const year = jakartaTime.getFullYear();
  return `${day}/${month}/${year}`;
};

// Payment Form Component
// function PaymentForm({ processing }: { processing: boolean }) {
//   const stripe = useStripe();
//   const elements = useElements();

//   return (
//     <div className="space-y-4">
//       <div className="border rounded-lg p-4">
//         <CardElement
//           options={{
//             style: {
//               base: {
//                 fontSize: '16px',
//                 color: '#424770',
//                 '::placeholder': { color: '#aab7c4' },
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }

export function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const createCustomer = useCreateCustomer();
  const createOrder = useCreateOrder();
  //   const stripe = useStripe();
  //   const elements = useElements();

  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Form data
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [terms, setTerms] = useState(false);

  if (items.length === 0) {
    router.push('/');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!terms) {
      toast.error('Please accept terms');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create Customer
      const customerRes = await createCustomer.mutateAsync({
        name: customer.name,
        transDate: getJakartaDate(),
        mobilePhone: customer.phone,
        email: customer.email,
        billStreet: address.street,
        billCity: address.city,
        billZipCode: address.zip,
      });

      console.log(customerRes, 'customerRes');

      // 2. Create Order
      const orderRes = await createOrder.mutateAsync({
        customerNo: customerRes.customer.customerNo,
        transDate: getJakartaDate(),
        items: items.map((item) => ({
          itemNo: item.productNo,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      });

      console.log(orderRes, 'orderRes');

      // 3. Process Payment (if card)
      //   if (paymentMethod === 'card' && stripe && elements) {
      //     const cardElement = elements.getElement(CardElement);
      //     const { error, paymentMethod } = await stripe.createPaymentMethod({
      //       type: 'card',
      //       card: cardElement!,
      //     });

      //     if (error) throw new Error(error.message);

      //     // Call your payment API
      //     await fetch('/api/payment', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({
      //         orderId: orderRes.data.id,
      //         amount: total,
      //         paymentMethodId: paymentMethod.id,
      //       }),
      //     });
      //   }

      // 4. Success
      clearCart();
      toast.success('Order placed!');
      router.push(`/orders/${orderRes.data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Maxwidth className="py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>

          {/* Step 1: Customer */}
          <Card>
            <CardHeader>
              <CardTitle>1. Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name *"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <Input
                placeholder="Email *"
                type="email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone *"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* Step 2: Address */}
          <Card>
            <CardHeader>
              <CardTitle>2. Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Street Address *"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <Input
                  placeholder="ZIP Code *"
                  value={address.zip}
                  onChange={(e) =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Payment */}
          <Card>
            <CardHeader>
              <CardTitle>3. Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
              </RadioGroup>

              {/* {paymentMethod === 'card' && <PaymentForm processing={processing} />} */}
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(c) => setTerms(c as boolean)}
            />
            <Label htmlFor="terms">I agree to Terms & Conditions</Label>
          </div>

          {/* Place Order Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={processing || !terms}
          >
            {processing
              ? 'Processing...'
              : `Place Order • $${total.toFixed(2)}`}
          </Button>
        </div>

        {/* Right - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Maxwidth>
  );
}

// Wrap with Stripe Provider
// export default function CheckoutPageWithStripe() {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutPage />
//     </Elements>
//   );
// }
