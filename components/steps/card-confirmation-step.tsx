"use client"

import { useEffect, useState } from "react"
import type { PaymentData } from "../payment-flow"

interface CardConfirmationStepProps {
  data: PaymentData
  status: "processing" | "success" | "error" | null
  errorMessage?: string
  onRetry?: () => void
  onStatusChange?: (status: "processing" | "success" | "error") => void
  onErrorChange?: (error: string) => void
}

export function CardConfirmationStep({
  data,
  status,
  errorMessage,
  onRetry,
  onStatusChange,
  onErrorChange,
}: CardConfirmationStepProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    if (status === "processing") {
      processCardPayment()
    }
  }, [])

  useEffect(() => {
    if (status !== "processing") {
      const timer = setTimeout(() => setAnimationComplete(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const processCardPayment = async () => {
    try {
      // Simulate card payment processing with NowPayments or payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo: 80% success rate
      const isSuccess = Math.random() > 0.2

      if (isSuccess) {
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            plan: data.plan,
            amount: data.selectedPlan?.price || 0,
            paymentMethod: "card",
            status: "active",
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Erreur lors de la création de l'abonnement")
        }

        setOrderNumber(result.orderNumber)
        onStatusChange?.("success")
      } else {
        throw new Error("Carte refusée par la banque")
      }
    } catch (error) {
      console.error("Error processing card payment:", error)
      onStatusChange?.("error")
      onErrorChange?.(error instanceof Error ? error.message : "Erreur lors du traitement du paiement")
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center py-8">
          <div
            className={`relative w-24 h-24 transition-all duration-1000 ${animationComplete ? "scale-100" : "scale-0"}`}
          >
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Paiement Confirmé !</h2>
          <p className="text-lg text-gray-600">Votre paiement a été traité avec succès</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 space-y-4 border border-green-200">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Numéro de commande</span>
              <span className="font-mono font-semibold text-gray-900">{orderNumber || data.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-gray-900 capitalize">{data.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Montant</span>
              <span className="font-medium text-gray-900">{data.selectedPlan?.price} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Méthode</span>
              <span className="font-medium text-gray-900">Carte Bancaire</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002 2V8.118z" />
              </svg>
              Email d'activation
            </p>
            <p className="text-sm text-blue-800">
              Vous recevrez un email d'activation à <strong>{data.email}</strong>. Cliquez sur le lien pour accéder à
              votre compte.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002 2V8.118z" />
              </svg>
              Confirmation de paiement
            </p>
            <p className="text-sm text-purple-800">
              Un email de confirmation de paiement réussi a été envoyé à <strong>{data.email}</strong> avec votre reçu
              et les détails de votre commande.
            </p>
          </div>
        </div>

        <div className="bg-green-100 rounded-lg p-4 text-center">
          <p className="text-green-900 font-semibold">Bienvenue ! Votre accès est actif immédiatement.</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center py-8">
          <div
            className={`relative w-24 h-24 transition-all duration-1000 ${animationComplete ? "scale-100" : "scale-0"}`}
          >
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Paiement Échoué</h2>
          <p className="text-lg text-gray-600">Nous n'avons pas pu traiter votre paiement</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-red-900">Raison de l'erreur :</p>
          <p className="text-sm text-red-800">
            {errorMessage || "Une erreur est survenue lors du traitement de votre paiement."}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-yellow-900">Suggestions :</p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Vérifiez les informations de votre carte bancaire</li>
            <li>• Assurez-vous que vous disposez de fonds suffisants</li>
            <li>• Contactez votre banque en cas de refus</li>
            <li>• Essayez avec une autre carte de paiement</li>
          </ul>
        </div>

        <button
          onClick={onRetry}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Réessayer le Paiement
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center py-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Traitement du Paiement</h2>
        <p className="text-lg text-gray-600">Veuillez patienter pendant que nous vérifions votre paiement...</p>
      </div>

      <div className="flex justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
