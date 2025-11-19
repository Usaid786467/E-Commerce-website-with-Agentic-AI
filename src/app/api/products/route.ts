import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/services/product-service'
import { ProductFilter } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Build filter from query params
    const filter: ProductFilter = {
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      brand: searchParams.get('brand')?.split(',') || undefined,
      rating: searchParams.get('rating')
        ? Number(searchParams.get('rating'))
        : undefined,
      stockStatus: searchParams.get('stockStatus')?.split(',') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      page: searchParams.get('page')
        ? Number(searchParams.get('page'))
        : 1,
      limit: searchParams.get('limit')
        ? Number(searchParams.get('limit'))
        : 20,
    }

    const result = await getProducts(filter)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}
