// app/api/payment/place-order/route.ts
import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const { orderId, customerName, items, totalAmount } = await request.json();

    console.log('🎯 Placing order after successful payment...');
    console.log('Order ID:', orderId);
    console.log('Customer:', customerName);
    console.log('Items:', items);

    const transDate = getJakartaDate();

    // Step 1: Create Customer in Accurate
    console.log('👥 Step 1: Creating customer...');

    const customerResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/accurate/customer/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          transDate: transDate,
          customerNo: `WEB-${Date.now()}`,
        }),
      }
    );

    const customerData = await customerResponse.json();

    if (!customerData.success) {
      throw new Error(`Failed to create customer: ${customerData.error}`);
    }

    const customerNo = customerData.customer.customerNo;
    console.log('✅ Customer created:', customerNo);

    // Step 2: Create Sales Order in Accurate
    console.log('📦 Step 2: Creating sales order...');

    const orderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/accurate/orders/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerNo: customerNo,
          transDate: transDate,
          description: `Web Order - ${orderId}`,
          detailMemo: `Payment successful - Midtrans Order ID: ${orderId}`,
          items: items.map((item: any) => ({
            itemNo: String(item.productNo || item.productId),
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

    console.log('✅ Sales order created successfully!');
    console.log('   Order Number:', orderData.data.number);
    console.log('   Order ID:', orderData.data.id);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        customerNo: customerNo,
        orderNumber: orderData.data.number,
        orderId: orderData.data.id,
        accurateOrderId: orderData.data.id,
        total: orderData.data.total,
      },
    });
  } catch (error: any) {
    console.error('❌ Error placing order:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}