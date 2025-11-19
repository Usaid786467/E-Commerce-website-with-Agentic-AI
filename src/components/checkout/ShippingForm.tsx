'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ShippingFormData,
  SHIPPING_METHODS,
  COUNTRIES,
  PAKISTAN_PROVINCES,
} from '@/types/checkout'
import { formatCurrency } from '@/lib/utils'
import { Truck, Package, Zap, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShippingFormProps {
  defaultValues?: Partial<ShippingFormData>
  onSubmit: (data: ShippingFormData) => void
  onBack?: () => void
}

const shippingIcons = {
  standard: Package,
  express: Truck,
  overnight: Zap,
  pickup: Store,
}

export function ShippingForm({ defaultValues, onSubmit, onBack }: ShippingFormProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultValues?.country || 'PK')
  const [selectedShipping, setSelectedShipping] = useState(
    defaultValues?.shippingMethod || 'standard'
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ShippingFormData>({
    defaultValues: {
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      addressLine1: defaultValues?.addressLine1 || '',
      addressLine2: defaultValues?.addressLine2 || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      postalCode: defaultValues?.postalCode || '',
      country: defaultValues?.country || 'PK',
      shippingMethod: defaultValues?.shippingMethod || 'standard',
      saveAddress: defaultValues?.saveAddress || false,
    },
  })

  const handleFormSubmit = (data: ShippingFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 300 1234567"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\d\s\-\+\(\)]+$/,
                    message: 'Invalid phone number',
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="addressLine1">
              Address Line 1 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addressLine1"
              placeholder="House/Flat No., Street Name"
              {...register('addressLine1', { required: 'Address is required' })}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive mt-1">{errors.addressLine1.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Apartment, suite, building, floor, etc."
              {...register('addressLine2')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Karachi"
                {...register('city', { required: 'City is required' })}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">
                State/Province <span className="text-destructive">*</span>
              </Label>
              {selectedCountry === 'PK' ? (
                <Select
                  onValueChange={(value) => setValue('state', value)}
                  defaultValue={defaultValues?.state}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAKISTAN_PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="state"
                  placeholder="State/Province"
                  {...register('state', { required: 'State is required' })}
                />
              )}
              {errors.state && (
                <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                placeholder="75500"
                {...register('postalCode', { required: 'Postal code is required' })}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="country">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => {
                setSelectedCountry(value)
                setValue('country', value)
              }}
              defaultValue={selectedCountry}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Method */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SHIPPING_METHODS.map((method) => {
            const Icon = shippingIcons[method.id as keyof typeof shippingIcons]
            return (
              <label
                key={method.id}
                className={cn(
                  'flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary',
                  {
                    'border-primary bg-primary/5': selectedShipping === method.id,
                  }
                )}
              >
                <input
                  type="radio"
                  value={method.id}
                  {...register('shippingMethod', { required: 'Please select a shipping method' })}
                  className="mt-1"
                  onChange={(e) => setSelectedShipping(e.target.value)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <span className="font-semibold">
                      {method.price === 0 ? 'FREE' : formatCurrency(method.price)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Estimated delivery: {method.estimatedDays}
                  </p>
                </div>
              </label>
            )
          })}
          {errors.shippingMethod && (
            <p className="text-sm text-destructive">{errors.shippingMethod.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Save Address Option */}
      <div className="flex items-center gap-2">
        <input
          id="saveAddress"
          type="checkbox"
          {...register('saveAddress')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="saveAddress" className="font-normal cursor-pointer">
          Save this address for future orders
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}
