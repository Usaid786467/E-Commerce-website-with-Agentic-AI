import { getFeaturedProducts, getNewArrivals } from '@/lib/services/product-service'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { generateSEO, generateOrganizationSchema, generateWebsiteSearchSchema } from '@/lib/seo'
import Script from 'next/script'

export const metadata = generateSEO({
  title: 'Home',
  description: 'Discover the best products at unbeatable prices. Free shipping on orders over PKR 2000. Shop electronics, fashion, home goods, and more with AI-powered recommendations.',
  url: '/',
})

export default async function HomePage() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6">
              Shop Smart with
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI-Powered Shopping
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing products with personalized recommendations powered by artificial intelligence.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked products just for you</p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts as any} columns={4} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available yet.</p>
              <Link href="/products" className="mt-4 inline-block">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">Check out the latest products</p>
            </div>
            <Link href="/products?new=true">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <ProductGrid products={newArrivals as any} columns={4} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No new arrivals available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-muted-foreground">
                All products are verified and checked for quality
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                Multiple payment options with secure checkout
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable shipping to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <Script id="organization-schema" type="application/ld+json">
        {JSON.stringify(generateOrganizationSchema())}
      </Script>
      <Script id="website-search-schema" type="application/ld+json">
        {JSON.stringify(generateWebsiteSearchSchema())}
      </Script>
    </div>
  )
}
