'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart-store'
import { formatCurrency, calculateDiscount } from '@/lib/utils'
import { ShoppingCart, Heart, Share2, Star, Minus, Plus, Package, Truck, Shield } from 'lucide-react'
import Link from 'next/link'

interface ProductInfoProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    description?: string | null
    shortDescription?: string | null
    brand?: string | null
    sku: string
    stockStatus: string
    stockQuantity: number
    ratingAverage: number
    ratingCount: number
    isSale?: boolean
    isNew?: boolean
    category?: {
      id: string
      name: string
      slug: string
    } | null
    variants?: Array<{
      id: string
      name: string
      price?: number | null
      stockQuantity: number
      isActive: boolean
    }>
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.id
  )
  const addItem = useCartStore((state) => state.addItem)

  const discount = product.compareAtPrice
    ? calculateDiscount(Number(product.compareAtPrice), Number(product.price))
    : 0

  const isOutOfStock = product.stockStatus === 'out_of_stock'
  const isLowStock = product.stockStatus === 'low_stock'

  const handleAddToCart = () => {
    const variant = product.variants?.find((v) => v.id === selectedVariant)

    addItem({
      productId: product.id,
      productVariantId: selectedVariant,
      name: product.name,
      slug: product.slug,
      price: variant?.price ? Number(variant.price) : Number(product.price),
      quantity,
      variant: variant
        ? {
            id: variant.id,
            name: variant.name,
          }
        : undefined,
      stockQuantity: variant?.stockQuantity || product.stockQuantity,
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {product.category && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-foreground"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      )}

      {/* Product Name */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold font-heading">{product.name}</h1>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {product.brand && (
          <p className="text-muted-foreground">by {product.brand}</p>
        )}
      </div>

      {/* Rating */}
      {product.ratingCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(Number(product.ratingAverage))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
          <span className="font-medium">
            {Number(product.ratingAverage).toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({product.ratingCount} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-primary">
            {formatCurrency(Number(product.price))}
          </span>
          {product.compareAtPrice && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                {formatCurrency(Number(product.compareAtPrice))}
              </span>
              <Badge variant="destructive" className="text-base">
                Save {discount}%
              </Badge>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-muted-foreground">{product.shortDescription}</p>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : isLowStock ? (
          <Badge variant="warning">Only few left!</Badge>
        ) : (
          <Badge variant="success">In Stock</Badge>
        )}
        <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Variant</label>
          <div className="grid grid-cols-3 gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                disabled={!variant.isActive || variant.stockQuantity === 0}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                  selectedVariant === variant.id
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'
                } ${
                  !variant.isActive || variant.stockQuantity === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Quantity</label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium w-12 text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setQuantity((q) =>
                Math.min(product.stockQuantity, q + 1)
              )
            }
            disabled={quantity >= product.stockQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
        <Button size="lg" variant="outline">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Features */}
      <div className="border-t pt-6 space-y-3">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Free Shipping</p>
            <p className="text-sm text-muted-foreground">
              On orders over PKR 2,000
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Easy Returns</p>
            <p className="text-sm text-muted-foreground">
              30-day return policy
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Secure Payment</p>
            <p className="text-sm text-muted-foreground">
              100% secure transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
