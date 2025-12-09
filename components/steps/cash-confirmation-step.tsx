"use client"

import { useEffect, useState } from "react"
import type { PaymentData } from "../payment-flow"

interface CashConfirmationStepProps {
  data: PaymentData
}

export function CashConfirmationStep({ data }: CashConfirmationStepProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>("")

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const createCashSubscription = async () => {
      try {
        console.log("[v0] Starting cash subscription creation")

        const paymentData = {
          email: data.email,
          plan: data.plan,
          paymentMethod: "cash", // Changed payment_method to paymentMethod to match API expectations
          amount: data.selectedPlan?.price || 0,
          status: "en_cours_de_traitement",
        }

        console.log("[v0] Payment data:", paymentData)

        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        })

        console.log("[v0] API response status:", response.status)
        const result = await response.json()
        console.log("[v0] API response:", result)

        if (result.subscription && result.subscription.order_number) {
          setOrderNumber(result.subscription.order_number)
          console.log("[v0] Subscription created successfully with order:", result.subscription.order_number)
        } else {
          console.error("[v0] No order number in response:", result)
        }
      } catch (error) {
        console.error("[v0] Error creating cash subscription:", error)
      }
    }

    createCashSubscription()
  }, [data.email, data.plan, data.selectedPlan?.price])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success Animation */}
      <div className="flex justify-center py-8">
        <div
          className={`relative w-24 h-24 transition-all duration-1000 ${animationComplete ? "scale-100" : "scale-0"}`}
        >
          <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-green-50 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Demande Enregistrée</h2>
        <p className="text-lg text-gray-600">Votre demande de paiement en espèce a été enregistrée avec succès</p>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 space-y-4 border border-green-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-1">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Détails de votre demande</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {orderNumber && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Numéro de commande</dt>
                  <dd className="text-gray-900 font-mono font-medium">{orderNumber}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Méthode de paiement</dt>
                <dd className="text-gray-900 font-medium">Espèce</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Plan sélectionné</dt>
                <dd className="text-gray-900 font-medium capitalize">{data.plan}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Montant</dt>
                <dd className="text-gray-900 font-medium">{data.selectedPlan?.price} MAD</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Email</dt>
                <dd className="text-gray-900 font-medium truncate">{data.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Info Messages */}
      <div className="space-y-3">
        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Information importante
          </p>
          <p className="text-sm text-blue-800">
            Votre demande a été transmise. Un de nos partenaires vous contactera pour finaliser le paiement en espèce.
          </p>
        </div>

        {/* Email Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Statut de la demande
          </p>
          <p className="text-sm text-green-800">
            Une notification a été envoyée à <strong>{data.email}</strong>. Votre demande est en cours de traitement.
          </p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex justify-center pt-4">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
