/**
 * SEO Utilities
 * Helper functions for generating SEO meta tags, Open Graph tags, and structured data
 */

import { Metadata } from 'next'

const siteConfig = {
  name: 'ShopHub',
  title: 'ShopHub - Your Premium E-Commerce Destination',
  description:
    'Discover the best products at unbeatable prices. Free shipping on orders over PKR 2000. Shop electronics, fashion, home goods, and more.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  twitterHandle: '@shophub',
}

/**
 * Generate metadata for pages
 */
export function generateSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const pageDescription = description || siteConfig.description
  const pageImage = image || siteConfig.ogImage
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    title: pageTitle,
    description: pageDescription,
    ...(noIndex && { robots: 'noindex, nofollow' }),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage.startsWith('http') ? pageImage : `${siteConfig.url}${pageImage}`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage.startsWith('http') ? pageImage : `${siteConfig.url}${pageImage}`],
      creator: siteConfig.twitterHandle,
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

/**
 * Generate product structured data (JSON-LD)
 */
export function generateProductSchema(product: {
  name: string
  description: string
  image?: string
  price: number
  currency?: string
  sku?: string
  brand?: string
  ratingValue?: number
  ratingCount?: number
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.image && {
      image: product.image.startsWith('http')
        ? product.image
        : `${siteConfig.url}${product.image}`,
    }),
    ...(product.sku && { sku: product.sku }),
    ...(product.brand && {
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
    }),
    offers: {
      '@type': 'Offer',
      url: siteConfig.url,
      priceCurrency: product.currency || 'PKR',
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      ...(product.condition && {
        itemCondition: `https://schema.org/${product.condition}`,
      }),
    },
    ...(product.ratingValue &&
      product.ratingCount && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.ratingValue,
          ratingCount: product.ratingCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  }

  return schema
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }

  return schema
}

/**
 * Generate organization structured data (JSON-LD)
 */
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-300-1234567',
      contactType: 'Customer Service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
    sameAs: [
      'https://www.facebook.com/shophub',
      'https://twitter.com/shophub',
      'https://www.instagram.com/shophub',
    ],
  }

  return schema
}

/**
 * Generate review structured data (JSON-LD)
 */
export function generateReviewSchema(reviews: {
  author: string
  rating: number
  reviewBody: string
  datePublished: Date
}[]) {
  return reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished.toISOString(),
  }))
}

/**
 * Generate website search box structured data (JSON-LD)
 */
export function generateWebsiteSearchSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return schema
}

export { siteConfig }
