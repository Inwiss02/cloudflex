import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all support requests ordered by created_at desc
    const { data: requests, error } = await supabase
      .from("support_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching support requests:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération des réclamations" }, { status: 500 })
    }

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Error in admin support requests:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
