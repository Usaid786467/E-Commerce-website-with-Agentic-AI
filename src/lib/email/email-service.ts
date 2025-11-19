import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
      to,
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    orderNumber: string
    totalAmount: number
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    shippingAddress: {
      firstName: string
      lastName: string
      addressLine1: string
      city: string
      state: string
      postalCode: string
    }
  }
) {
  const { orderNumber, totalAmount, items, shippingAddress } = orderData

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your order! We're preparing your items for shipment.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #667eea;">Order Details</h2>
      <p><strong>Order Number:</strong> #${orderNumber}</p>
      <p><strong>Total Amount:</strong> PKR ${totalAmount.toFixed(2)}</p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #667eea;">Order Items</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${items
          .map(
            (item) => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;">${item.name}</td>
            <td style="padding: 10px 0; text-align: center;">×${item.quantity}</td>
            <td style="padding: 10px 0; text-align: right;">PKR ${item.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #667eea;">Shipping Address</h2>
      <p style="margin: 5px 0;">${shippingAddress.firstName} ${shippingAddress.lastName}</p>
      <p style="margin: 5px 0;">${shippingAddress.addressLine1}</p>
      <p style="margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderNumber}"
         style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Track Your Order
      </a>
    </div>

    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
      If you have any questions, please contact our support team.
    </p>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderNumber}`,
    html,
  })
}

export async function sendShippingNotificationEmail(
  email: string,
  orderData: {
    orderNumber: string
    trackingNumber?: string
    courierName?: string
    estimatedDelivery?: Date
  }
) {
  const { orderNumber, trackingNumber, courierName, estimatedDelivery } = orderData

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🚚 Your Order Has Shipped!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Great news! Your order is on its way.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #667eea;">Shipping Details</h2>
      <p><strong>Order Number:</strong> #${orderNumber}</p>
      ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
      ${courierName ? `<p><strong>Courier:</strong> ${courierName}</p>` : ''}
      ${
        estimatedDelivery
          ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString()}</p>`
          : ''
      }
    </div>

    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; color: #1e40af;">
        <strong>What's Next?</strong><br>
        Your package will be delivered to your doorstep. You can track your order using the link below.
      </p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderNumber}"
         style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Track Your Order
      </a>
    </div>

    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
      Thank you for shopping with us!
    </p>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: `Your Order #${orderNumber} Has Shipped!`,
    html,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Store!</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>

    <p>Thank you for joining our community! We're excited to have you with us.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #667eea;">Get Started</h2>
      <ul style="padding-left: 20px;">
        <li>Browse thousands of products</li>
        <li>Enjoy secure checkout with multiple payment options</li>
        <li>Track your orders in real-time</li>
        <li>Get personalized recommendations</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}"
         style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Start Shopping
      </a>
    </div>

    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
      Happy shopping!
    </p>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Our Store!',
    html,
  })
}
