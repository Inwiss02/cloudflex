import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

async function sendSupportWebhookNotification(
  supportRequest: any,
  oldStatus: string
) {
  try {
    const webhookUrl =
      "https://workflows.cloudflex.art/webhook/899f5084-3507-4d8a-899b-693972e620bc";

    const payload = {
      type: "support_status_change",
      support_request_id: supportRequest.id,
      email: supportRequest.email,
      objet: supportRequest.objet,
      criticite: supportRequest.criticite,
      message: supportRequest.message,
      old_status: oldStatus,
      new_status: supportRequest.status,
      created_at: supportRequest.created_at,
      updated_at: supportRequest.updated_at,
      resolved_at: supportRequest.resolved_at,
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send support webhook notification:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID et statut requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: currentRequest } = await supabase
      .from("support_requests")
      .select()
      .eq("id", id)
      .single();

    const oldStatus = currentRequest?.status || "inconnu";

    // Update support request status
    const updateData: any = { status };

    // If status is resolved, set resolved_at timestamp
    if (status === "resolu" || status === "ferme") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from("support_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating support request:", updateError);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour" },
        { status: 500 }
      );
    }

    await sendSupportWebhookNotification(updatedRequest, oldStatus);

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error("Error in update-support-status:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
