'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

interface ProductTabsProps {
  description: string
  attributes: Array<{
    id: string
    attributeName: string
    attributeValue: string
  }>
  reviews: Array<{
    id: string
    rating: number
    title?: string | null
    comment?: string | null
    createdAt: Date
    user?: {
      id: string
      firstName: string
      lastName: string
      avatarUrl?: string | null
    } | null
    images?: Array<{
      id: string
      imageUrl: string
    }>
    isVerifiedPurchase: boolean
  }>
  productId: string
}

export function ProductTabs({
  description,
  attributes,
  reviews,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')

  const tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'specifications' as const, label: 'Specifications' },
    { id: 'reviews' as const, label: `Reviews (${reviews.length})` },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b bg-muted/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-muted-foreground">
                No description available for this product.
              </p>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            {attributes.length > 0 ? (
              <table className="w-full">
                <tbody>
                  {attributes.map((attr, index) => (
                    <tr
                      key={attr.id}
                      className={index % 2 === 0 ? 'bg-muted/30' : ''}
                    >
                      <td className="px-4 py-3 font-medium w-1/3">
                        {attr.attributeName}
                      </td>
                      <td className="px-4 py-3">{attr.attributeValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted-foreground">
                No specifications available for this product.
              </p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* User Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                        {review.user
                          ? review.user.firstName[0] + review.user.lastName[0]
                          : 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.user
                              ? `${review.user.firstName} ${review.user.lastName}`
                              : 'Anonymous'}
                          </span>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                  )}

                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-muted-foreground mb-3">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image) => (
                        <div
                          key={image.id}
                          className="relative w-20 h-20 rounded-md overflow-hidden"
                        >
                          <Image
                            src={image.imageUrl}
                            alt="Review image"
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
