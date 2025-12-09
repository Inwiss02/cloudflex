import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

function calculateEndDate(plan: string, startDate: Date): Date {
  const endDate = new Date(startDate)

  switch (plan) {
    case "semestre":
      endDate.setMonth(endDate.getMonth() + 6)
      break
    case "annuel":
      endDate.setFullYear(endDate.getFullYear() + 1)
      break
    case "2ans":
      endDate.setFullYear(endDate.getFullYear() + 2)
      break
  }

  return endDate
}

async function sendStatusChangeWebhook(subscriptionData: any) {
  try {
    const webhookUrl = "https://inwiss.app.n8n.cloud/webhook/899f5084-3507-4d8a-899b-693972e620bc"

    const payload = {
      email: subscriptionData.email,
      plan: subscriptionData.plan,
      amount: subscriptionData.amount,
      payment_method: subscriptionData.payment_method,
      crypto_currency: subscriptionData.crypto_currency,
      crypto_network: subscriptionData.crypto_network,
      order_number: subscriptionData.order_number,
      old_status: subscriptionData.old_status,
      new_status: subscriptionData.status,
      subscription_start_date: subscriptionData.subscription_start_date,
      subscription_end_date: subscriptionData.subscription_end_date,
      updated_at: new Date().toISOString(),
      event_type: "status_changed",
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("Webhook failed:", await response.text())
    } else {
      console.log("Webhook sent successfully")
    }
  } catch (error) {
    console.error("Error sending webhook:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, status } = await request.json()

    if (!email || !status) {
      return NextResponse.json({ error: "Email et statut requis" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current subscription
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json({ error: "Abonnement non trouvé" }, { status: 404 })
    }

    const oldStatus = subscription.status

    // Calculate dates if status is active
    const updateData: any = { status }

    if (status === "active" && !subscription.subscription_start_date) {
      const startDate = new Date()
      const endDate = calculateEndDate(subscription.plan, startDate)

      updateData.subscription_start_date = startDate.toISOString()
      updateData.subscription_end_date = endDate.toISOString()
    }

    // Update subscription status
    const { data: updatedSubscription, error: updateError } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("email", email.toLowerCase())
      .select()
      .single()

    if (updateError) {
      console.error("Error updating subscription:", updateError)
      return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
    }

    await sendStatusChangeWebhook({
      ...updatedSubscription,
      old_status: oldStatus,
    })

    return NextResponse.json({ subscription: updatedSubscription })
  } catch (error) {
    console.error("Error in update-subscription-status:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
