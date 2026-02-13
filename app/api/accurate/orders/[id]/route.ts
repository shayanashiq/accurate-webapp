import { accurateFetch } from '@/lib/accurate';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  const id = params.id;

  console.log(`\n📦 Fetching sales order detail for id: ${id}`);

  if (!id || id === 'undefined') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid order ID',
      },
      { status: 400 }
    );
  }

  try {
    // Fetch sales order detail from Accurate API
    const detailResponse = await accurateFetch(
      `/accurate/api/sales-order/detail.do?id=${id}`
    );

    console.log(`✅ Successfully fetched order detail for id: ${id}`);

    if (!detailResponse.s) {
      console.warn(`⚠️  Order detail API returned error:`, detailResponse.d);
      return NextResponse.json(
        {
          success: false,
          error: detailResponse.d || 'Failed to fetch order detail',
        },
        { status: 404 }
      );
    }

    const orderData = detailResponse.d || {};

    // Return minimal e-commerce order data
    return NextResponse.json({
      success: true,
      order: {
        // Order Info
        id: orderData.id || null,
        number: orderData.number || null,
        transDate: orderData.transDate || null,
        shipDate: orderData.shipDate || null,
        status: orderData.status || null,
        statusName: orderData.statusName || null,

        // Customer Info
        customerId: orderData.customerId || null,
        customer: {
          id: orderData.customer?.id || null,
          customerNo: orderData.customer?.customerNo || null,
          name: orderData.customer?.name || null,
          email: orderData.customer?.contactInfo?.email || null,
          mobilePhone: orderData.customer?.contactInfo?.mobilePhone || null,
        },

        // Shipping Address
        toAddress: orderData.toAddress || null,
        shipAddress: {
          street: orderData.customer?.shipAddress?.street || null,
          city: orderData.customer?.shipAddress?.city || null,
          province: orderData.customer?.shipAddress?.province || null,
          country: orderData.customer?.shipAddress?.country || null,
          zipCode: orderData.customer?.shipAddress?.zipCode || null,
        },

        // Items
        items:
          orderData.detailItem?.map((item: any) => ({
            id: item.id || null,
            seq: item.seq || null,
            itemId: item.itemId || null,
            itemNo: item.item?.no || null,
            itemName: item.detailName || null,
            quantity: item.quantity || 0,
            unitPrice: item.unitPrice || 0,
            discount: item.itemDiscPercent || null,
            totalPrice: item.totalPrice || 0,
            unit: item.itemUnit?.name || null,
            notes: item.detailNotes || null,
          })) || [],

        // Financial
        subTotal: orderData.subTotal || 0,
        totalExpense: orderData.totalExpense || 0,
        discount: orderData.cashDiscount || 0,
        tax1Amount: orderData.tax1Amount || 0,
        tax2Amount: orderData.tax2Amount || 0,
        totalAmount: orderData.totalAmount || 0,

        // Currency
        currency: {
          code: orderData.currency?.code || null,
          symbol: orderData.currency?.symbol || null,
        },

        // Payment
        paymentTerm: {
          id: orderData.paymentTermId || null,
          name: orderData.paymentTerm?.name || null,
          netDays: orderData.paymentTerm?.netDays || 0,
        },

        // Additional Info
        description: orderData.description || null,
        poNumber: orderData.poNumber || null,
      },
    });
  } catch (err: any) {
    console.error(`❌ Error fetching order detail for id ${id}:`, err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
