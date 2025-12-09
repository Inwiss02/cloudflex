"use client"

import { useState } from "react"
import type { PaymentData } from "../payment-flow"

interface SummaryStepProps {
  data: PaymentData
  onBack: () => void
}

export function SummaryStep({ data, onBack }: SummaryStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error">("pending")

  const planDetails = {
    starter: {
      name: "Starter",
      price: 29,
      description: "Parfait pour commencer",
      features: ["Sans engagement", "Tarif très attractif", "Accès illimité et synchronisé sur tous vos appareils"],
      billing: "Facturation mensuelle",
    },
    pro: {
      name: "Pro",
      price: 79,
      description: "Pour les professionnels",
      features: ["Support prioritaire 24/7", "Fonctionnalités avancées", "Synchronisation en temps réel"],
      billing: "Facturation mensuelle",
    },
    enterprise: {
      name: "Entreprise",
      price: 199,
      description: "Pour les grandes équipes",
      features: ["Déploiement personnalisé", "Support dédié", "Intégrations illimitées"],
      billing: "Facturation mensuelle",
    },
  }

  const plan = data.plan ? planDetails[data.plan] : null

  const handleSubmit = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          plan: data.plan,
          paymentMethod: data.paymentMethod,
          amount: planDetails[data.plan!]?.price,
          currency: data.paymentMethod === "crypto" ? data.cryptoCurrency : "MAD",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPaymentStatus("success")
        setIsProcessing(false)
        setIsCompleted(true)
      } else {
        setPaymentStatus("error")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
      setIsProcessing(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="text-center space-y-6 animate-in fade-in scale-in duration-500">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement confirmé !</h2>
          <p className="text-gray-600">
            Un email de confirmation a été envoyé à <span className="font-semibold">{data.email}</span>
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
          <p className="text-sm text-green-800">✓ Votre plan {plan?.name} est maintenant actif</p>
          <p className="text-sm text-green-800 mt-2">✓ Accès immédiat à toutes les fonctionnalités</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Commencer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Récapitulatif</h2>
        <p className="text-gray-600">Vérifiez vos informations avant de confirmer</p>
      </div>

      {/* Email Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Adresse email</h3>
        <p className="text-gray-900 font-medium">{data.email}</p>
      </div>

      {/* Plan Section */}
      {plan && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Détails du plan</h3>
          <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">MAD{plan.price}</p>
                <p className="text-sm text-gray-600">/mois</p>
              </div>
            </div>

            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-blue-200 mt-4 pt-4">
              <p className="text-sm text-gray-600">{plan.billing}</p>
            </div>
          </div>
        </div>
      )}

      {/* Card Section - Added card info summary */}
      {data.cardNumber && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Méthode de paiement</h3>
          <p className="text-gray-900 font-medium">Carte se terminant par {data.cardNumber.slice(-4)}</p>
          <p className="text-sm text-gray-600 mt-1">Titulaire: {data.cardholderName}</p>
        </div>
      )}

      {/* Price Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Sous-total</span>
          <span>MAD{plan?.price}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>MAD{plan?.price}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Traitement...
            </>
          ) : (
            "Confirmer le paiement"
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">Votre paiement est sécurisé et crypté</p>
    </div>
  )
}
