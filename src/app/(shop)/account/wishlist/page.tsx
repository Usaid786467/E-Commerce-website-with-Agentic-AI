'use client'

import { useWishlistStore } from '@/store/wishlist-store'
import { useCartStore } from '@/store/cart-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.productName,
      slug: item.productSlug,
      price: item.price,
      quantity: 1,
      image: item.image,
      stockQuantity: item.inStock ? 10 : 0, // Placeholder
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Wishlist</h2>
          <p className="text-muted-foreground mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Save items you love for later. They'll appear here.
            </p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.productId} className="group relative">
              <button
                onClick={() => removeItem(item.productId)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from wishlist"
              >
                <X className="h-4 w-4" />
              </button>

              <Link href={`/products/${item.productSlug}`}>
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="pt-4">
                <Link href={`/products/${item.productSlug}`}>
                  <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary transition-colors">
                    {item.productName}
                  </h3>
                </Link>
                <p className="text-lg font-bold mb-3">{formatCurrency(item.price)}</p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
