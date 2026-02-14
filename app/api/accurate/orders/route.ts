//app/api/accurate/orders/route.ts
import { NextResponse } from 'next/server';
import { accurateFetch } from '@/lib/accurate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const customerNo = searchParams.get('customerNo');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('📦 Fetching sales orders list...');

    // Build query parameters
    const queryParams = new URLSearchParams({
      fields: 'id,number,transDate,customer,total,status',
      'sp.page': String(page),
      'sp.pageSize': String(pageSize),
    });

    // Add filters if provided
    if (customerNo) {
      queryParams.append('filter.customerNo.op', 'EXACT');
      queryParams.append('filter.customerNo', customerNo);
    }

    if (startDate) {
      queryParams.append('filter.transDate.op', 'GREATER_THAN_OR_EQUAL');
      queryParams.append('filter.transDate', startDate);
    }

    if (endDate) {
      queryParams.append('filter.transDate.op', 'LESS_THAN_OR_EQUAL');
      queryParams.append('filter.transDate', endDate);
    }

    const listResponse = await accurateFetch(
      `/accurate/api/sales-order/list.do?${queryParams.toString()}`
    );

    console.log(`📊 Found ${listResponse.d?.length || 0} sales orders`);

    if (!listResponse.s) {
      return NextResponse.json(
        {
          success: false,
          error: listResponse.d || 'Failed to fetch sales orders',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: listResponse.d || [],
      pagination: listResponse.sp || {
        page,
        pageSize: pageSize,
        pageCount: 1,
        rowCount: 0,
      },
    });
  } catch (err: any) {
    console.error('❌ Error fetching sales orders:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
