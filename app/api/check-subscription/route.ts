import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch subscription by email
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching subscription:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération de l'abonnement" }, { status: 500 })
    }

    if (!subscription) {
      return NextResponse.json({ error: "Aucun abonnement trouvé", subscription: null }, { status: 404 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("Error in check-subscription:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
