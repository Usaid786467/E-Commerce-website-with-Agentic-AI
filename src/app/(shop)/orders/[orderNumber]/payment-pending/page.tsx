import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Clock, AlertCircle, Smartphone, ArrowRight, RefreshCw } from 'lucide-react'

interface PaymentPendingPageProps {
  params: {
    orderNumber: string
  }
}

async function getOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      orderNumber: true,
      paymentMethod: true,
      paymentStatus: true,
      totalAmount: true,
      createdAt: true,
      guestEmail: true,
    },
  })

  return order
}

export default async function PaymentPendingPage({ params }: PaymentPendingPageProps) {
  const order = await getOrder(params.orderNumber)

  if (!order) {
    notFound()
  }

  const getPaymentMethodDisplay = () => {
    switch (order.paymentMethod) {
      case 'easypaisa':
        return 'EasyPaisa'
      case 'jazzcash':
        return 'JazzCash'
      default:
        return 'Mobile Wallet'
    }
  }

  return (
    <div className="container-wide section-padding">
      <div className="max-w-2xl mx-auto">
        {/* Pending Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <Clock className="h-10 w-10 text-yellow-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold font-heading mb-2">
            Payment Pending
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Complete your payment on {getPaymentMethodDisplay()} to confirm your order
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
            Order Number:{' '}
            <span className="font-mono font-semibold text-foreground">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Instructions Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Smartphone className="h-5 w-5" />
              Payment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-blue-900">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-xs">
                  1
                </span>
                <span>
                  Open your <strong>{getPaymentMethodDisplay()}</strong> mobile app
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-xs">
                  2
                </span>
                <span>
                  Check for the payment request notification
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-xs">
                  3
                </span>
                <span>
                  Enter your PIN and approve the payment of{' '}
                  <strong>{formatCurrency(Number(order.totalAmount))}</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-xs">
                  4
                </span>
                <span>
                  Wait for confirmation - your order will be confirmed automatically
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{getPaymentMethodDisplay()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount to Pay</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(Number(order.totalAmount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  <Clock className="h-3 w-3" />
                  Awaiting Payment
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-2">Important Notes:</p>
                <ul className="text-amber-800 space-y-1 list-disc list-inside">
                  <li>Payment request is valid for 30 minutes</li>
                  <li>If you don't see a payment request, check your app notifications</li>
                  <li>Your order will be automatically cancelled if payment is not completed within 24 hours</li>
                  <li>
                    You will receive an email at <strong>{order.guestEmail}</strong> once payment
                    is confirmed
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button asChild size="lg">
            <Link href={`/orders/${order.orderNumber}`}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Payment Status
            </Link>
          </Button>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/help">Need Help?</Link>
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-center">
          <p className="text-muted-foreground">
            Having trouble with payment?{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact our support team
            </Link>{' '}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}
