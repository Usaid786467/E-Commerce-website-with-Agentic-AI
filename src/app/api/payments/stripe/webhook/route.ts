import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session.metadata?.orderId) {
          console.error('No orderId in session metadata')
          break
        }

        // Update order payment status
        await prisma.order.update({
          where: { id: session.metadata.orderId },
          data: {
            paymentStatus: 'paid',
            status: 'confirmed',
            paymentId: session.payment_intent as string,
          },
        })

        // Create payment record
        await prisma.payment.create({
          data: {
            orderId: session.metadata.orderId,
            paymentMethod: 'stripe',
            paymentGateway: 'stripe',
            transactionId: session.payment_intent as string,
            amount: new Decimal(session.amount_total! / 100),
            currency: session.currency?.toUpperCase() || 'PKR',
            status: 'paid',
            paymentData: {
              sessionId: session.id,
              customerEmail: session.customer_email,
            },
          },
        })

        console.log(`Payment successful for order ${session.metadata.orderNumber}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.metadata?.orderId) {
          await prisma.order.update({
            where: { id: session.metadata.orderId },
            data: {
              paymentStatus: 'failed',
              status: 'cancelled',
            },
          })

          await prisma.payment.create({
            data: {
              orderId: session.metadata.orderId,
              paymentMethod: 'stripe',
              paymentGateway: 'stripe',
              transactionId: session.id,
              amount: new Decimal(session.amount_total! / 100),
              currency: session.currency?.toUpperCase() || 'PKR',
              status: 'failed',
              errorMessage: 'Checkout session expired',
            },
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { paymentId: paymentIntent.id },
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'failed',
            },
          })

          await prisma.payment.create({
            data: {
              orderId: order.id,
              paymentMethod: 'stripe',
              paymentGateway: 'stripe',
              transactionId: paymentIntent.id,
              amount: new Decimal(paymentIntent.amount / 100),
              currency: paymentIntent.currency.toUpperCase(),
              status: 'failed',
              errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
