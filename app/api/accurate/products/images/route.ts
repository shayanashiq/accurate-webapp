//app/api/accurate/products/images/route.ts
import { accurateFetch } from '@/lib/accurate';
import { NextResponse } from 'next/server';

// Get the base URL from environment or construct it
const ACCURATE_BASE_URL = process.env.ACCURATE_BASE_URL || 'https://zeus.accurate.id';

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'productIds array is required' },
        { status: 400 }
      );
    }

    console.log(`🖼️  Fetching images for ${productIds.length} products...`);

    const imagePromises = productIds.map((id: string | number) =>
      accurateFetch(`/accurate/api/item/detail.do?id=${id}`)
        .then(detailRes => ({
          productId: id,
          images: detailRes.d?.detailItemImage?.map((img: any) => ({
            id: img.id,
            fileName: img.fileName ? `${ACCURATE_BASE_URL}${img.fileName}` : null,
            thumbnailPath: img.thumbnailPath ? `${ACCURATE_BASE_URL}${img.thumbnailPath}` : null,
            originalName: img.originalName,
            seq: img.seq,
          })) || [],
          thumbnail: detailRes.d?.detailItemImage?.[0]?.thumbnailPath 
            ? `${ACCURATE_BASE_URL}${detailRes.d.detailItemImage[0].thumbnailPath}` 
            : null,
        }))
        .catch(err => ({
          productId: id,
          images: [],
          thumbnail: null,
          error: err.message,
        }))
    );

    const imagesData = await Promise.all(imagePromises);

    return NextResponse.json({
      success: true,
      data: imagesData,
    });
  } catch (err: any) {
    console.error('❌ Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}