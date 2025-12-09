import { type NextRequest, NextResponse } from "next/server"

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY
const NOWPAYMENTS_IPN_KEY = process.env.NOWPAYMENTS_IPN_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan, paymentMethod, amount, cardData, cryptoCurrency } = body

    if (!email || !plan || !paymentMethod || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!NOWPAYMENTS_API_KEY) {
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create payment invoice with NowPayments
    const paymentPayload = {
      price_amount: amount,
      price_currency: "usd",
      order_id: orderId,
      order_description: `${plan} Plan Subscription for ${email}`,
      customer_email: email,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/nowpayments`,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel?order=${orderId}`,
      is_fixed_rate: false,
    }

    // Add payment method specific parameters
    if (paymentMethod === "card") {
      Object.assign(paymentPayload, {
        pay_currency: "usd",
        type: "donation", // or 'invoice'
      })
    } else if (paymentMethod === "crypto") {
      Object.assign(paymentPayload, {
        pay_currency: cryptoCurrency.toUpperCase(),
      })
    }

    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": NOWPAYMENTS_API_KEY,
      },
      body: JSON.stringify(paymentPayload),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] NowPayments API error:", errorData)
      return NextResponse.json({ error: "Payment creation failed", details: errorData }, { status: response.status })
    }

    const paymentData = await response.json()

    // Store payment info in database/session (optional)
    // You can save this to your database:
    // await savePaymentToDatabase({
    //   orderId,
    //   email,
    //   plan,
    //   paymentMethod,
    //   amount,
    //   paymentId: paymentData.id,
    //   status: "pending",
    //   createdAt: new Date(),
    // })

    return NextResponse.json({
      success: true,
      paymentId: paymentData.id,
      invoiceId: paymentData.id,
      paymentLink: paymentData.invoice_url,
      orderId,
      message: "Payment initiated successfully",
    })
  } catch (error) {
    console.error("[v0] Payment creation error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
