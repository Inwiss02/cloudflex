import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all subscriptions ordered by created_at desc
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching subscriptions:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération des abonnements" }, { status: 500 })
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("Error in admin subscriptions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
