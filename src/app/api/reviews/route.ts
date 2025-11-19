import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeReviewSentiment } from '@/lib/services/gemini-service'
import { Decimal } from '@prisma/client/runtime/library'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, rating, title, comment } = body

    // Validate required fields
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user has purchased this product (for verified purchase badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          paymentStatus: 'paid',
        },
      },
    })

    // Analyze sentiment using AI
    let sentimentData = null
    try {
      const sentiment = await analyzeReviewSentiment(comment)
      sentimentData = {
        score: sentiment.score,
        sentiment: sentiment.sentiment,
        keyPhrases: sentiment.keyPhrases,
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      // Continue without sentiment if AI fails
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title: title || null,
        comment,
        isVerified: !!hasPurchased,
        sentiment: sentimentData,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    // Update product rating
    const reviewStats = await prisma.review.aggregate({
      where: { productId, status: 'approved' },
      _avg: { rating: true },
      _count: true,
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: new Decimal(reviewStats._avg.rating || 0),
        ratingCount: reviewStats._count,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'review_created',
        entity: 'review',
        entityId: review.id,
        changes: {
          productId,
          rating,
          sentiment: sentimentData?.sentiment,
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: 'approved',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform for frontend
    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      userName: review.user.name || 'Anonymous',
      userImage: review.user.image,
      createdAt: review.createdAt,
      verified: review.isVerified,
      helpfulCount: review.helpfulCount,
      sentiment: review.sentiment,
      images: review.images,
    }))

    return NextResponse.json(transformedReviews)
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
