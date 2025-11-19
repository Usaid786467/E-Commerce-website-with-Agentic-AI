import { NextRequest, NextResponse } from 'next/server'
import { enhanceProductSearch } from '@/lib/services/gemini-service'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Use Gemini AI to enhance the search query
    const enhancedParams = await enhanceProductSearch(query)

    return NextResponse.json(enhancedParams)
  } catch (error) {
    console.error('AI search enhancement error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance search' },
      { status: 500 }
    )
  }
}
