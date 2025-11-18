'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentFormData, PAYMENT_METHOD_OPTIONS } from '@/types/checkout'
import { PaymentMethod } from '@/types/order'
import {
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentSelectionProps {
  defaultValues?: Partial<PaymentFormData>
  onSubmit: (data: PaymentFormData) => void
  onBack: () => void
}

const paymentIcons: Record<string, any> = {
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
}

export function PaymentSelection({ defaultValues, onSubmit, onBack }: PaymentSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    defaultValues?.paymentMethod || 'stripe'
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: defaultValues?.paymentMethod || 'stripe',
      cardholderName: defaultValues?.cardholderName || '',
      cardNumber: defaultValues?.cardNumber || '',
      cardExpiry: defaultValues?.cardExpiry || '',
      cardCvc: defaultValues?.cardCvc || '',
      mobileNumber: defaultValues?.mobileNumber || '',
      orderNotes: defaultValues?.orderNotes || '',
    },
  })

  const handleFormSubmit = (data: PaymentFormData) => {
    onSubmit(data)
  }

  const renderPaymentFields = () => {
    switch (selectedMethod) {
      case 'stripe':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Card Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardholderName">
                  Cardholder Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  {...register('cardholderName', {
                    required: selectedMethod === 'stripe' ? 'Cardholder name is required' : false,
                  })}
                />
                {errors.cardholderName && (
                  <p className="text-sm text-destructive mt-1">{errors.cardholderName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cardNumber">
                  Card Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  {...register('cardNumber', {
                    required: selectedMethod === 'stripe' ? 'Card number is required' : false,
                    pattern: {
                      value: /^[\d\s]{13,19}$/,
                      message: 'Invalid card number',
                    },
                  })}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">
                    Expiry Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    {...register('cardExpiry', {
                      required: selectedMethod === 'stripe' ? 'Expiry date is required' : false,
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        message: 'Invalid format (MM/YY)',
                      },
                    })}
                  />
                  {errors.cardExpiry && (
                    <p className="text-sm text-destructive mt-1">{errors.cardExpiry.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cardCvc">
                    CVC <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    maxLength={4}
                    {...register('cardCvc', {
                      required: selectedMethod === 'stripe' ? 'CVC is required' : false,
                      pattern: {
                        value: /^\d{3,4}$/,
                        message: 'Invalid CVC',
                      },
                    })}
                  />
                  {errors.cardCvc && (
                    <p className="text-sm text-destructive mt-1">{errors.cardCvc.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-muted rounded-lg text-sm">
                <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  Your card details are secured with 256-bit SSL encryption
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 'easypaisa':
      case 'jazzcash':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {selectedMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mobileNumber">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobileNumber"
                  placeholder="+92 300 1234567"
                  {...register('mobileNumber', {
                    required:
                      selectedMethod === 'easypaisa' || selectedMethod === 'jazzcash'
                        ? 'Mobile number is required'
                        : false,
                    pattern: {
                      value: /^[\d\s\-\+\(\)]+$/,
                      message: 'Invalid mobile number',
                    },
                  })}
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.mobileNumber.message}</p>
                )}
              </div>

              <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Payment Instructions:</p>
                  <ol className="text-blue-800 space-y-1 list-decimal list-inside">
                    <li>You will receive a payment request on your mobile</li>
                    <li>Open your {selectedMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} app</li>
                    <li>Approve the payment to complete your order</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'cod':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Cash on Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-amber-900">
                  <p className="font-medium mb-2">Payment Instructions:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Pay in cash when your order is delivered</li>
                    <li>Please keep exact change ready</li>
                    <li>COD charges may apply for certain areas</li>
                    <li>Delivery person will provide payment receipt</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PAYMENT_METHOD_OPTIONS.map((method) => {
            const Icon = paymentIcons[method.icon]
            return (
              <label
                key={method.id}
                className={cn(
                  'flex items-start gap-4 p-4 border rounded-lg transition-all',
                  {
                    'border-primary bg-primary/5': selectedMethod === method.id,
                    'cursor-pointer hover:border-primary': method.supported,
                    'opacity-50 cursor-not-allowed': !method.supported,
                  }
                )}
              >
                <input
                  type="radio"
                  value={method.id}
                  {...register('paymentMethod', { required: 'Please select a payment method' })}
                  className="mt-1"
                  onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                  disabled={!method.supported}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{method.name}</span>
                    {!method.supported && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Coming Soon</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                </div>
              </label>
            )
          })}
          {errors.paymentMethod && (
            <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      {renderPaymentFields()}

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Order Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="orderNotes">Additional instructions for delivery</Label>
          <textarea
            id="orderNotes"
            {...register('orderNotes')}
            className="w-full min-h-[100px] px-3 py-2 border rounded-md mt-2 resize-none"
            placeholder="E.g., Please call before delivery, Leave at doorstep, etc."
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back to Shipping
        </Button>
        <Button type="submit" className="flex-1">
          Review Order
        </Button>
      </div>
    </form>
  )
}
