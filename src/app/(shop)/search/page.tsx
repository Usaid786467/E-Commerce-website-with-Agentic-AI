'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Sparkles, X } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParam = searchParams.get('q') || ''

  const [query, setQuery] = useState(queryParam)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAIEnhancing, setIsAIEnhancing] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState([
    'iPhone 14',
    'Wireless headphones',
    'Smart watch',
    'Gaming laptop',
    'Running shoes',
  ])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery) return

    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5)

    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Search products
  const performSearch = async (searchQuery: string, withAI = false) => {
    if (!searchQuery.trim()) {
      setProducts([])
      setTotalResults(0)
      return
    }

    setIsLoading(true)
    saveSearch(searchQuery)

    try {
      let searchParams: any = { search: searchQuery }

      // Use AI to enhance search
      if (withAI) {
        setIsAIEnhancing(true)
        try {
          const aiResponse = await fetch('/api/ai/enhance-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: searchQuery }),
          })

          if (aiResponse.ok) {
            const aiData = await aiResponse.json()
            setAiSuggestions(aiData)

            // Apply AI-suggested filters
            if (aiData.category) searchParams.category = aiData.category
            if (aiData.minPrice) searchParams.minPrice = aiData.minPrice
            if (aiData.maxPrice) searchParams.maxPrice = aiData.maxPrice
            if (aiData.brand) searchParams.brand = aiData.brand
          }
        } catch (error) {
          console.error('AI enhancement error:', error)
        } finally {
          setIsAIEnhancing(false)
        }
      }

      // Fetch products
      const queryString = new URLSearchParams(searchParams).toString()
      const response = await fetch(`/api/products?${queryString}`)

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalResults(data.total || 0)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, false)
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
  }

  // Handle AI-enhanced search
  const handleAISearch = () => {
    performSearch(query, true)
  }

  // Initial search on mount if query exists
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam, false)
    }
  }, [queryParam])

  const clearSearch = () => {
    setQuery('')
    setProducts([])
    setTotalResults(0)
    setAiSuggestions(null)
    router.push('/search')
  }

  return (
    <div className="container-wide section-padding">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Search Products</h1>
        <p className="text-muted-foreground">
          Find exactly what you're looking for with AI-powered search
        </p>
      </div>

      {/* Search Bar */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="pl-10 pr-10 h-12 text-lg"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Button type="submit" size="lg" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {/* AI Search Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleAISearch}
                disabled={isAIEnhancing || !query.trim()}
                className="gap-2"
              >
                {isAIEnhancing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI is analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Enhance with AI
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* AI Suggestions */}
          {aiSuggestions && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">AI Detected:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.category && (
                  <Badge variant="secondary">Category: {aiSuggestions.category}</Badge>
                )}
                {aiSuggestions.brand && (
                  <Badge variant="secondary">Brand: {aiSuggestions.brand}</Badge>
                )}
                {aiSuggestions.minPrice && (
                  <Badge variant="secondary">
                    Min: PKR {aiSuggestions.minPrice}
                  </Badge>
                )}
                {aiSuggestions.maxPrice && (
                  <Badge variant="secondary">
                    Max: PKR {aiSuggestions.maxPrice}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {totalResults > 0 && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{queryParam}"
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : queryParam ? (
        <div className="text-center py-20">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or use AI to enhance it
          </p>
        </div>
      ) : (
        <div>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      performSearch(search, false)
                      router.push(`/search?q=${encodeURIComponent(search)}`)
                    }}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search)
                    performSearch(search, false)
                    router.push(`/search?q=${encodeURIComponent(search)}`)
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
