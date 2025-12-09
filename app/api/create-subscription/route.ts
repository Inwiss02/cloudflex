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

  endDate.setDate(endDate.getDate() + 1)

  return endDate
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${randomStr}`
}

async function sendWebhookNotification(subscriptionData: any) {
  const webhookUrl = "https://inwiss.app.n8n.cloud/webhook/12491343-d669-4d2b-8205-aa1446479cfe"

  try {
    const payload = {
      email: subscriptionData.email,
      plan: subscriptionData.plan,
      amount: subscriptionData.amount,
      payment_method: subscriptionData.payment_method,
      crypto_currency: subscriptionData.crypto_currency || null,
      crypto_network: subscriptionData.crypto_network || null,
      order_number: subscriptionData.order_number,
      status: subscriptionData.status,
      subscription_start_date: subscriptionData.subscription_start_date,
      subscription_end_date: subscriptionData.subscription_end_date,
      created_at: subscriptionData.created_at,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] 📤 Sending webhook notification to n8n:", JSON.stringify(payload, null, 2))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // Increased timeout to 10s

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const responseText = await response.text()
    console.log("[v0] ✅ Webhook response status:", response.status, "Body:", responseText)

    if (!response.ok) {
      console.error("[v0] ❌ Webhook failed with status:", response.status, "Body:", responseText)
    }

    return response.ok
  } catch (error: any) {
    console.error("[v0] ❌ Webhook error:", error.message || error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, plan, amount, paymentMethod, cryptoCurrency, cryptoNetwork, status = "pending" } = body

    if (!email || !plan || typeof amount !== "number" || !paymentMethod) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    if (!["semestre", "annuel", "2ans"].includes(plan)) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existingList } = await supabase.from("subscriptions").select("*").eq("email", email.toLowerCase())

    const existing = existingList && existingList.length > 0 ? existingList[0] : null

    const orderNumber = generateOrderNumber()
    const startDate = new Date()
    const endDate = calculateEndDate(plan, startDate)

    if (existing) {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          plan,
          amount,
          payment_method: paymentMethod,
          crypto_currency: cryptoCurrency || null,
          crypto_network: cryptoNetwork || null,
          order_number: orderNumber,
          status,
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
        })
        .eq("email", email.toLowerCase())
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: "Erreur lors de la mise à jour de l'abonnement" }, { status: 500 })
      }

      console.log("[v0] 🔄 Updating subscription, calling webhook for:", email)
      await sendWebhookNotification(data)

      return NextResponse.json({ subscription: data, orderNumber })
    } else {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          email: email.toLowerCase(),
          plan,
          amount,
          payment_method: paymentMethod,
          crypto_currency: cryptoCurrency || null,
          crypto_network: cryptoNetwork || null,
          order_number: orderNumber,
          status,
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: "Erreur lors de la création de l'abonnement" }, { status: 500 })
      }

      console.log("[v0] ✨ Creating new subscription, calling webhook for:", email)
      await sendWebhookNotification(data)

      return NextResponse.json({ subscription: data, orderNumber })
    }
  } catch (error) {
    console.error("[v0] Error in create-subscription:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
