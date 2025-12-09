"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Calendar,
  CreditCard,
  Package,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Subscription = {
  id: string;
  email: string;
  plan: string;
  amount: number;
  payment_method: string;
  crypto_currency?: string;
  crypto_network?: string;
  order_number: string;
  status: "active" | "pending" | "en_cours_de_traitement" | "expired";
  subscription_start_date: string;
  subscription_end_date: string;
  created_at: string;
};

export default function MonComptePage() {
  const [email, setEmail] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubscription(null);

    try {
      const response = await fetch("/api/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la vérification");
      }

      if (data.subscription) {
        setSubscription(data.subscription);
      } else {
        setError("Aucun abonnement trouvé pour cet email.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = () => {
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Actif</span>
          </div>
        );
      case "en_cours_de_traitement":
        return (
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">En cours de traitement</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">En cours de vérification</span>
          </div>
        );
      case "expired":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="font-semibold">Non renouvelé</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "semestre":
        return "6 mois";
      case "annuel":
        return "1 an";
      case "2ans":
        return "2 ans";
      default:
        return plan;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Mon Compte</h1>
          <p className="text-gray-600">Vérifiez l'état de votre abonnement</p>
        </div>

        {!subscription ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Vérifier mon abonnement</CardTitle>
              <CardDescription>
                Entrez votre email pour consulter les détails de votre
                abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckSubscription} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Vérification..." : "Suivant"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Détails de l'abonnement</CardTitle>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base font-semibold">
                        {subscription.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plan</p>
                      <p className="text-base font-semibold">
                        {getPlanLabel(subscription.plan)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Montant payé
                      </p>
                      <p className="text-base font-semibold">
                        {subscription.amount} MAD
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Méthode de paiement
                      </p>
                      <p className="text-base font-semibold capitalize">
                        {subscription.payment_method === "crypto"
                          ? `${subscription.crypto_currency} (${subscription.crypto_network})`
                          : subscription.payment_method === "cash"
                          ? "Espèce"
                          : "Carte bancaire"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date d'abonnement
                      </p>
                      <p className="text-base font-semibold">
                        {subscription.subscription_start_date
                          ? new Date(
                              subscription.subscription_start_date
                            ).toLocaleDateString("fr-FR")
                          : "En attente"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date d'expiration
                      </p>
                      <p className="text-base font-semibold">
                        {subscription.subscription_end_date
                          ? new Date(
                              subscription.subscription_end_date
                            ).toLocaleDateString("fr-FR")
                          : "En attente"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Numéro de commande
                      </p>
                      <p className="text-base font-mono font-semibold">
                        {subscription.order_number}
                      </p>
                    </div>
                  </div>
                </div>

                {subscription.status === "en_cours_de_traitement" && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Votre paiement est en cours de traitement. Vous recevrez
                      un email d'activation de votre compte dès que le paiement
                      sera confirmé avec succès.
                    </AlertDescription>
                  </Alert>
                )}

                {subscription.status === "pending" && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Votre paiement est en cours de confirmation. Vous recevrez
                      un email d'activation dès que le paiement sera confirmé.
                    </AlertDescription>
                  </Alert>
                )}

                {subscription.status === "expired" && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Votre abonnement a expiré. Cliquez sur le bouton
                      ci-dessous pour le renouveler.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setSubscription(null)}>
                Vérifier un autre compte
              </Button>
              {subscription.status === "expired" && (
                <Button onClick={handleRenew} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Renouveler l'abonnement
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
