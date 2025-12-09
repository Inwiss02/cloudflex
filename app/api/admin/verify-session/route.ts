import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // In production, verify JWT token properly
    // For now, simple token check
    try {
      Buffer.from(token, "base64").toString()
      return NextResponse.json({ authenticated: true })
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
