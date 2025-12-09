import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if admin exists and password matches
    const { data: admin, error } = await supabase.from("admins").select("*").eq("email", email).single()

    if (error || !admin) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Verify password using pgcrypto
    const { data: passwordCheck } = await supabase.rpc("verify_admin_password", {
      admin_email: email,
      admin_password: password,
    })

    if (!passwordCheck) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Update last login
    await supabase.from("admins").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

    // Generate simple token (in production, use JWT)
    const token = Buffer.from(`${admin.id}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Erreur lors de la connexion" }, { status: 500 })
  }
}
