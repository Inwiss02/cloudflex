import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan, amount, cardData, orderId } = body

    if (!email || !plan || !amount || !cardData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For testing: simulate payment processing
    // In production, NowPayments handles card processing through their hosted payment page

    // Simulate random success/failure (80% success rate for demo)
    const isSuccess = Math.random() < 0.8

    if (!isSuccess) {
      return NextResponse.json(
        {
          success: false,
          status: "failed",
          message: "Card declined. Please verify your card details and try again.",
          errorCode: "card_declined",
        },
        { status: 400 },
      )
    }

    // Payment successful - send confirmation emails
    await sendPaymentEmails(email, plan, amount, "card", orderId)

    return NextResponse.json({
      success: true,
      status: "completed",
      orderId,
      message: "Payment processed successfully",
    })
  } catch (error) {
    console.error("[v0] Card processing error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}

async function sendPaymentEmails(email: string, plan: string, amount: number, method: string, orderId: string) {
  console.log(`[v0] Would send email to ${email} for ${method} payment of $${amount} for ${plan} plan`)

  // Example using Resend (uncomment and add API key):
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@yourdomain.com',
  //   to: email,
  //   subject: 'Payment Confirmation',
  //   html: `<h1>Payment Successful</h1><p>Your ${plan} plan is now active!</p>`,
  // })
}
