'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Star, X } from 'lucide-react'
import { useState } from 'react'

interface ProductFiltersProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  brands: string[]
  selectedFilters: {
    categoryId?: string
    minPrice?: string
    maxPrice?: string
    brand?: string[]
    rating?: string
  }
}

export function ProductFilters({
  categories,
  brands,
  selectedFilters,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(selectedFilters.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(selectedFilters.maxPrice || '')

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset to page 1 when filters change
    params.set('page', '1')

    router.push(`/products?${params.toString()}`)
  }

  const toggleBrand = (brand: string) => {
    const currentBrands = selectedFilters.brand || []
    let newBrands: string[]

    if (currentBrands.includes(brand)) {
      newBrands = currentBrands.filter((b) => b !== brand)
    } else {
      newBrands = [...currentBrands, brand]
    }

    updateFilter('brand', newBrands.length > 0 ? newBrands.join(',') : null)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (minPrice) {
      params.set('minPrice', minPrice)
    } else {
      params.delete('minPrice')
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice)
    } else {
      params.delete('maxPrice')
    }

    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const search = searchParams.get('search')
    if (search) {
      router.push(`/products?search=${search}`)
    } else {
      router.push('/products')
    }
    setMinPrice('')
    setMaxPrice('')
  }

  const hasActiveFilters =
    selectedFilters.categoryId ||
    selectedFilters.minPrice ||
    selectedFilters.maxPrice ||
    (selectedFilters.brand && selectedFilters.brand.length > 0) ||
    selectedFilters.rating

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Active Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-auto p-0 text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.categoryId && (
              <Badge variant="secondary" className="gap-1">
                Category
                <button onClick={() => updateFilter('categoryId', null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedFilters.brand?.map((brand) => (
              <Badge key={brand} variant="secondary" className="gap-1">
                {brand}
                <button onClick={() => toggleBrand(brand)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {(selectedFilters.minPrice || selectedFilters.maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                Price
                <button
                  onClick={() => {
                    updateFilter('minPrice', null)
                    updateFilter('maxPrice', null)
                    setMinPrice('')
                    setMaxPrice('')
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedFilters.rating && (
              <Badge variant="secondary" className="gap-1">
                {selectedFilters.rating}+ Stars
                <button onClick={() => updateFilter('rating', null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  updateFilter(
                    'categoryId',
                    selectedFilters.categoryId === category.id
                      ? null
                      : category.id
                  )
                }
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFilters.categoryId === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold">Price Range</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs">
                Min
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs">
                Max
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={applyPriceFilter}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.brand?.includes(brand) || false}
                  onChange={() => toggleBrand(brand)}
                  className="rounded"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="space-y-3">
        <h3 className="font-semibold">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                updateFilter(
                  'rating',
                  selectedFilters.rating === String(rating)
                    ? null
                    : String(rating)
                )
              }
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedFilters.rating === String(rating)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
