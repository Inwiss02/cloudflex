import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "ID d'abonnement requis" },
        { status: 400 }
      );
    }

    // Récupérer les infos avant suppression pour le webhook
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: "Abonnement introuvable" },
        { status: 404 }
      );
    }

    // Supprimer l'abonnement
    const { error: deleteError } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", subscriptionId);

    if (deleteError) {
      console.error("Error deleting subscription:", deleteError);
      return NextResponse.json(
        { error: "Erreur lors de la suppression" },
        { status: 500 }
      );
    }

    // Envoyer notification webhook
    try {
      const webhookUrl =
        "https://inwiss.app.n8n.cloud/webhook/899f5084-3507-4d8a-899b-693972e620bc";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscription_deleted",
          subscription: {
            id: subscription.id,
            email: subscription.email,
            plan: subscription.plan,
            amount: subscription.amount,
            deleted_at: new Date().toISOString(),
          },
        }),
      });
    } catch (webhookError) {
      console.error("Webhook notification failed:", webhookError);
    }

    return NextResponse.json({
      success: true,
      message: "Abonnement supprimé avec succès",
    });
  } catch (error) {
    console.error("Error in delete subscription:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
