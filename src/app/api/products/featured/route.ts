import { NextRequest, NextResponse } from 'next/server'
import { getFeaturedProducts } from '@/lib/services/product-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : 8

    const products = await getFeaturedProducts(limit)

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
      },
      { status: 500 }
    )
  }
}
