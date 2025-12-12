import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, objet, criticite, message } = body;

    // Validate required fields
    if (!email || !objet || !message) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: supportRequest, error: dbError } = await supabase
      .from("support_requests")
      .insert({
        email,
        objet,
        criticite: criticite || "moyenne",
        message,
        status: "nouveau",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    const webhookUrl =
      "https://workflows.cloudflex.art/webhook/6d938ba3-f471-43ff-9f1a-556a2417644a";

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "support_request",
          id: supportRequest.id,
          email,
          objet,
          criticite: criticite || "moyenne",
          message,
          status: "nouveau",
          created_at: supportRequest.created_at,
        }),
      });

      if (!webhookResponse.ok) {
        console.error(
          "Webhook notification failed:",
          await webhookResponse.text()
        );
      } else {
        console.log("✅ Support webhook notification sent successfully");
      }
    } catch (webhookError) {
      console.error("Failed to send webhook notification:", webhookError);
    }

    return NextResponse.json({
      success: true,
      id: supportRequest.id,
    });
  } catch (error) {
    console.error("Error processing support request:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
