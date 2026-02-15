// app/api/payment/create-transaction/route.ts
import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

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
    const { orderId, customerName, items, grossAmount, tableNumber } = await request.json();

    // Create Snap API instance
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customerName,
        email: 'customer@store.com',
        phone: '081234567890',
      },
      item_details: items.map((item: any) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderId}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Store order data in session/database for later use
    // For now, we'll pass it through the success page

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderData: {
        orderId,
        customerName,
        items,
        grossAmount,
        tableNumber,
      },
    });
  } catch (error: any) {
    console.error('Midtrans Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}