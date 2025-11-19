'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cart-store'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { PaymentSelection } from '@/components/checkout/PaymentSelection'
import { OrderReview } from '@/components/checkout/OrderReview'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  CheckoutStep,
  ShippingFormData,
  PaymentFormData,
} from '@/types/checkout'
import { CreateOrderInput } from '@/types/order'
import { SHIPPING_METHODS } from '@/types/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, itemsCount, subtotal, clearCart } = useCartStore()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingData, setShippingData] = useState<Partial<ShippingFormData>>({})
  const [paymentData, setPaymentData] = useState<Partial<PaymentFormData>>({})

  // Redirect if cart is empty
  useEffect(() => {
    if (itemsCount === 0) {
      router.push('/')
    }
  }, [itemsCount, router])

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (session?.user?.email && !shippingData.email) {
      setShippingData((prev) => ({
        ...prev,
        email: session.user.email!,
      }))
    }
  }, [session, shippingData.email])

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data)
    setCompletedSteps((prev) => [...new Set([...prev, 'shipping'])])
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data)
    setCompletedSteps((prev) => [...new Set([...prev, 'payment'])])
    setCurrentStep('review')
  }

  const handleBackToShipping = () => {
    setCurrentStep('shipping')
  }

  const handleBackToPayment = () => {
    setCurrentStep('payment')
  }

  const handlePlaceOrder = async () => {
    if (!shippingData || !paymentData) {
      return
    }

    setIsProcessing(true)

    try {
      // Prepare order data
      const shippingMethod = SHIPPING_METHODS.find(
        (m) => m.id === shippingData.shippingMethod
      )

      const orderData: CreateOrderInput = {
        items: items.map((item) => ({
          productId: item.productId,
          productVariantId: item.variantId || undefined,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          userId: session?.user?.id || undefined,
          firstName: shippingData.firstName!,
          lastName: shippingData.lastName!,
          addressLine1: shippingData.addressLine1!,
          addressLine2: shippingData.addressLine2,
          city: shippingData.city!,
          state: shippingData.state!,
          postalCode: shippingData.postalCode!,
          country: shippingData.country!,
          phone: shippingData.phone!,
          isDefault: shippingData.saveAddress || false,
        },
        paymentMethod: paymentData.paymentMethod!,
        shippingMethod: shippingData.shippingMethod!,
        customerNotes: paymentData.orderNotes,
      }

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create order')
      }

      const order = await response.json()

      // Handle payment based on method
      if (paymentData.paymentMethod === 'stripe') {
        // Redirect to Stripe checkout
        const paymentResponse = await fetch('/api/payments/stripe/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.totalAmount,
            currency: order.currency,
          }),
        })

        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment session')
        }

        const { url } = await paymentResponse.json()

        // Clear cart before redirecting
        clearCart()

        // Redirect to Stripe
        window.location.href = url
      } else if (
        paymentData.paymentMethod === 'easypaisa' ||
        paymentData.paymentMethod === 'jazzcash'
      ) {
        // For mobile wallets, we'll redirect to a pending payment page
        clearCart()
        router.push(`/orders/${order.orderNumber}/payment-pending`)
      } else if (paymentData.paymentMethod === 'cod') {
        // For COD, redirect directly to confirmation
        clearCart()
        router.push(`/orders/${order.orderNumber}/confirmation`)
      }
    } catch (error) {
      console.error('Order creation failed:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to place order. Please try again.'
      )
      setIsProcessing(false)
    }
  }

  // Don't render if cart is empty
  if (itemsCount === 0) {
    return null
  }

  return (
    <div className="container-wide section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold font-heading">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your purchase by providing shipping and payment information
          </p>
        </div>

        {/* Progress Steps */}
        <CheckoutSteps currentStep={currentStep} completedSteps={completedSteps} />

        {/* Main Content */}
        <div className="mt-8">
          {currentStep === 'shipping' && (
            <ShippingForm
              defaultValues={shippingData}
              onSubmit={handleShippingSubmit}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentSelection
              defaultValues={paymentData}
              onSubmit={handlePaymentSubmit}
              onBack={handleBackToShipping}
            />
          )}

          {currentStep === 'review' && (
            <OrderReview
              shippingData={shippingData as ShippingFormData}
              paymentData={paymentData as PaymentFormData}
              onBack={handleBackToPayment}
              onEditShipping={() => setCurrentStep('shipping')}
              onEditPayment={() => setCurrentStep('payment')}
              onConfirm={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          )}
        </div>

        {/* Empty Cart Notice */}
        {currentStep !== 'review' && (
          <Card className="mt-8 bg-muted/50">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{itemsCount} items in cart</p>
                    <p className="text-sm text-muted-foreground">
                      Review your cart before checkout
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">View Cart</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
