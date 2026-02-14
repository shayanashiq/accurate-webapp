// app/api/payment/create-transaction/route.ts
import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

export async function POST(request: Request) {
  try {
    const { orderId, customerName, items, grossAmount } = await request.json();

    // Create Snap API instance
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
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
      },
      item_details: items.map((item: any) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error: any) {
    console.error('Midtrans Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}