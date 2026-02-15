// app/api/payment/webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function getJakartaDate(): string {
  const now = new Date();
  const jakartaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  );

  const day = String(jakartaTime.getDate()).padStart(2, '0');
  const month = String(jakartaTime.getMonth() + 1).padStart(2, '0');
  const year = jakartaTime.getFullYear();

  return `${day}/${month}/${year}`;
}

async function createCustomerAndOrder(
  customerName: string,
  items: any[],
  orderId: string
) {
  try {
    const transDate = getJakartaDate();

    // Step 1: Create Customer
    console.log('👥 Creating customer:', customerName);

    const customerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/accurate/customer/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          transDate: transDate,
          customerNo: `WEB-${Date.now()}`,
          email: 'customer@store.com',
          mobilePhone: '081234567890',
        }),
      }
    );

    const customerData = await customerResponse.json();

    if (!customerData.success) {
      throw new Error(`Failed to create customer: ${customerData.error}`);
    }

    const customerNo = customerData.customer.customerNo;
    console.log('✅ Customer created:', customerNo);

    // Step 2: Create Sales Order
    console.log('📦 Creating sales order...');

    const orderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/accurate/orders/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerNo: customerNo,
          transDate: transDate,
          description: `Web Order - ${orderId}`,
          detailMemo: `Payment via Midtrans - Order ID: ${orderId}`,
          items: items.map((item) => ({
            itemNo: item.productNo || item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      throw new Error(`Failed to create order: ${orderData.error}`);
    }

    console.log('✅ Sales order created:', orderData.data.number);

    return {
      success: true,
      customerNo,
      orderNumber: orderData.data.number,
      orderId: orderData.data.id,
    };
  } catch (error: any) {
    console.error('❌ Error creating customer/order:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function POST(request: Request) {
  try {
    const notification = await request.json();

    console.log('🔔 Midtrans Notification:', notification);

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;

    // Verify signature
    const hash = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    if (hash !== signatureKey) {
      console.error('❌ Invalid signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 403 }
      );
    }

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    // Handle payment success
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        console.log('✅ Payment successful! Creating order in Accurate...');

        const customerName = 'Customer';
        const items:any[] = [];

        const result = await createCustomerAndOrder(
          customerName,
          items,
          orderId
        );

        if (result.success) {
          console.log('✅ Order created successfully in Accurate!');
        } else {
          console.error('❌ Failed to create order:', result.error);
        }
      }
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      console.log('❌ Payment failed/cancelled');
    } else if (transactionStatus === 'pending') {
      console.log('⏳ Payment pending');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}