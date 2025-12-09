"use client"

import type { PaymentData, PaymentMethod } from "../payment-flow"

interface PaymentMethodStepProps {
  data: PaymentData
  onNext: (stepData: any) => void
  onBack: () => void
}

export function PaymentMethodStep({ onNext, onBack }: PaymentMethodStepProps) {
  const handleSelectMethod = (method: PaymentMethod) => {
    onNext({ paymentMethod: method })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisir une méthode de paiement</h2>
        <p className="text-gray-600">Sélectionnez comment vous souhaitez payer</p>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Payment */}
        <button
          onClick={() => handleSelectMethod("card")}
          className="group border-2 border-gray-300 hover:border-blue-600 rounded-lg p-6 text-left transition-all duration-200 hover:shadow-lg hover:bg-blue-50"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Carte Bancaire</h3>
              <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, Amex</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✓ Paiement instantané</li>
            <li>✓ Totalement sécurisé</li>
            <li>✓ Sans frais supplémentaires</li>
          </ul>
        </button>

        {/* Crypto Payment */}
        <button
          onClick={() => handleSelectMethod("crypto")}
          className="group border-2 border-gray-300 hover:border-amber-600 rounded-lg p-6 text-left transition-all duration-200 hover:shadow-lg hover:bg-amber-50"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600">Cryptomonnaies</h3>
              <p className="text-sm text-gray-600 mt-1">Bitcoin, Ethereum, USDT...</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
                <path d="M15.5 12c0-1.93-1.57-3.5-3.5-3.5S8.5 10.07 8.5 12s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5z" />
              </svg>
            </div>
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✓ Confidentialité maximale</li>
            <li>✓ Transactions rapides</li>
            <li>✓ Frais réduits</li>
          </ul>
        </button>

        <button
          onClick={() => handleSelectMethod("cash")}
          className="group border-2 border-gray-300 hover:border-green-600 rounded-lg p-6 text-left transition-all duration-200 hover:shadow-lg hover:bg-green-50"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Espèce</h3>
              <p className="text-sm text-gray-600 mt-1">Paiement en main propre</p>
            </div>
            <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✓ Rendez-vous en personne</li>
            <li>✓ Paiement sécurisé</li>
            <li>✓ Confirmation immédiate</li>
          </ul>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">💡 Tous les paiements sont traités de manière sécurisée</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Retour
        </button>
      </div>
    </div>
  )
}
