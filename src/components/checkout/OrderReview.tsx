'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShippingFormData, PaymentFormData, SHIPPING_METHODS } from '@/types/checkout'
import { useCartStore } from '@/store/cart-store'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { Edit, Package, CreditCard, MapPin, FileText } from 'lucide-react'

interface OrderReviewProps {
  shippingData: ShippingFormData
  paymentData: PaymentFormData
  onBack: () => void
  onEditShipping: () => void
  onEditPayment: () => void
  onConfirm: () => void
  isProcessing?: boolean
}

export function OrderReview({
  shippingData,
  paymentData,
  onBack,
  onEditShipping,
  onEditPayment,
  onConfirm,
  isProcessing = false,
}: OrderReviewProps) {
  const { items, subtotal } = useCartStore()

  // Calculate shipping cost
  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === shippingData.shippingMethod)
  const shippingCost = shippingMethod?.price || 0

  // Calculate tax (10% for Pakistan)
  const taxRate = 0.10
  const taxAmount = subtotal * taxRate

  // Calculate total
  const totalAmount = subtotal + shippingCost + taxAmount

  // Format payment method display
  const getPaymentMethodDisplay = () => {
    switch (paymentData.paymentMethod) {
      case 'stripe':
        return `Card ending in ${paymentData.cardNumber?.slice(-4) || '****'}`
      case 'easypaisa':
        return `EasyPaisa (${paymentData.mobileNumber})`
      case 'jazzcash':
        return `JazzCash (${paymentData.mobileNumber})`
      case 'cod':
        return 'Cash on Delivery'
      default:
        return paymentData.paymentMethod
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items ({items.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.variantName && (
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Information
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEditShipping}
              disabled={isProcessing}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Contact</p>
            <p className="font-medium">{shippingData.email}</p>
            <p className="text-sm text-muted-foreground">{shippingData.phone}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</p>
            <p className="font-medium">
              {shippingData.firstName} {shippingData.lastName}
            </p>
            <p className="text-sm">{shippingData.addressLine1}</p>
            {shippingData.addressLine2 && (
              <p className="text-sm">{shippingData.addressLine2}</p>
            )}
            <p className="text-sm">
              {shippingData.city}, {shippingData.state} {shippingData.postalCode}
            </p>
            <p className="text-sm">{shippingData.country}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Method</p>
            <p className="font-medium">{shippingMethod?.name}</p>
            <p className="text-sm text-muted-foreground">{shippingMethod?.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEditPayment}
              disabled={isProcessing}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{getPaymentMethodDisplay()}</p>
          {paymentData.orderNotes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-1">Order Notes</p>
              <p className="text-sm">{paymentData.orderNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <div className="p-4 bg-muted rounded-lg text-sm">
        <p className="text-muted-foreground">
          By placing this order, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          . You will receive an email confirmation once your order is placed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isProcessing}
        >
          Back to Payment
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className="flex-1"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  )
}
