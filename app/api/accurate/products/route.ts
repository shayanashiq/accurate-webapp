//app/api/accurate/products/route.ts
import { accurateFetch } from '@/lib/accurate';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('📦 Fetching products with images...');

    // Fetch products with image URLs and detailed fields
    const response = await accurateFetch(
      '/accurate/api/item/list.do?fields=id,name,no,itemType,unitPrice,unit1Name,category,image,imageUrlThumb'
    );

    console.log('✅ Products fetched successfully');
    console.log('📊 Sample product:', response.d?.[0]);

    return NextResponse.json({
      success: true,
      count: response.d?.length || 0,
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
