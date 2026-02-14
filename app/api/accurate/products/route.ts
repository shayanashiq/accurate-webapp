//app/api/accurate/products/route.ts
import { accurateFetch } from '@/lib/accurate';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get pagination params from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    console.log(`📦 Fetching products - Page ${page}, Size ${pageSize}...`);

    // Fetch products with pagination
    const response = await accurateFetch(
      `/accurate/api/item/list.do?fields=id,name,no,itemType,unitPrice,unit1Name,category,image,imageUrlThumb&sp.page=${page}&sp.pageSize=${pageSize}`
    );

    console.log('✅ Products fetched successfully');
    console.log('📊 Sample product:', response.d?.[0]);

    return NextResponse.json({
      success: true,
      page,
      pageSize,
      count: response.d?.length || 0,
      totalCount: response.totalCount || response.sp?.rowCount || 0,
      products: response.d || [],
    });
  } catch (err: any) {
    console.error('❌ Error:', err);

    return NextResponse.json(
      {
        error: err.message || 'Internal server error',
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}