import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const NOWPAYMENTS_IPN_KEY = process.env.NOWPAYMENTS_IPN_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook signature if IPN key is provided
    if (NOWPAYMENTS_IPN_KEY) {
      const signature = request.headers.get("x-nowpayments-sig")
      if (!signature || !verifySignature(body, signature)) {
        console.error("[v0] Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const { id, payment_status, order_id, pay_amount, pay_currency, price_amount, price_currency } = body

    console.log(`[v0] Webhook: Payment ${id} status = ${payment_status}`)

    // Handle different payment statuses
    switch (payment_status) {
      case "waiting":
      case "confirming":
        // Payment is being confirmed
        console.log(`[v0] Payment ${id} is being confirmed`)
        break

      case "confirmed":
      case "finished":
        // Payment successful - activate subscription
        console.log(`[v0] Payment ${id} confirmed - activating subscription for order ${order_id}`)

        // Update database and send activation email
        // await activateSubscription(order_id)
        // await sendActivationEmail(orderData.email)
        break

      case "failed":
      case "expired":
        // Payment failed
        console.log(`[v0] Payment ${id} failed with status ${payment_status}`)

        // Notify user of failure
        // await sendPaymentFailedEmail(order_id)
        break

      case "refunded":
        // Payment refunded
        console.log(`[v0] Payment ${id} was refunded`)
        break
    }

    return NextResponse.json({ success: true, message: "Webhook processed" })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}

function verifySignature(payload: any, signature: string): boolean {
  try {
    const message = JSON.stringify(payload)
    const hash = crypto.createHmac("sha512", NOWPAYMENTS_IPN_KEY!).update(message).digest("hex")
    return hash === signature
  } catch (error) {
    console.error("[v0] Signature verification error:", error)
    return false
  }
}
