'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, X, Upload } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface ProductFormData {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  salePrice?: number
  sku: string
  brand?: string
  stockQuantity: number
  categoryId: string
  status: 'draft' | 'active' | 'inactive'
  isFeatured: boolean
  isNewArrival: boolean
  images: string[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
}

interface ProductVariant {
  name: string
  sku: string
  price?: number
  stockQuantity: number
}

interface ProductAttribute {
  name: string
  value: string
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  productId?: string
  categories: { id: string; name: string }[]
}

export function ProductForm({ initialData, productId, categories }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    salePrice: undefined,
    sku: '',
    brand: '',
    stockQuantity: 0,
    categoryId: '',
    status: 'draft',
    isFeatured: false,
    isNewArrival: false,
    images: [],
    variants: [],
    attributes: [],
    ...initialData,
  })

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !productId) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [formData.name, productId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', sku: '', price: undefined, stockQuantity: 0 }],
    }))
  }

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }))
  }

  const handleAddAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '' }],
    }))
  }

  const handleRemoveAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }))
  }

  const handleAttributeChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      ),
    }))
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = prompt('Enter image URL (for now, use Cloudinary or direct URLs):')
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }))
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
      const method = productId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save product')
      }

      alert(productId ? 'Product updated successfully!' : 'Product created successfully!')
      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Product save error:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="product-slug"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief product description"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description *</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none"
              placeholder="Detailed product description..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="PROD-001"
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand name"
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (PKR) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Sale Price (PKR)</Label>
              <Input
                id="salePrice"
                name="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice || ''}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button type="button" onClick={handleAddImage} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Image URL
            </Button>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Product Variants (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" onClick={handleAddVariant} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>

          {formData.variants.map((variant, index) => (
            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-4 gap-4">
                <Input
                  placeholder="Variant name (e.g., Red, Large)"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price (optional)"
                  value={variant.price || ''}
                  onChange={(e) =>
                    handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)
                  }
                />
                <Input
                  type="number"
                  placeholder="Stock"
                  value={variant.stockQuantity}
                  onChange={(e) =>
                    handleVariantChange(index, 'stockQuantity', parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <Button
                type="button"
                onClick={() => handleRemoveVariant(index)}
                variant="destructive"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attributes */}
      <Card>
        <CardHeader>
          <CardTitle>Product Attributes (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" onClick={handleAddAttribute} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Attribute
          </Button>

          {formData.attributes.map((attr, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Input
                placeholder="Attribute name (e.g., Material)"
                value={attr.name}
                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g., Cotton)"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleRemoveAttribute(index)}
                variant="destructive"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Featured Product</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>New Arrival</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : productId ? (
            'Update Product'
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  )
}
