"use client"

import type React from "react"
import { useState } from "react"
import type { PaymentData } from "../payment-flow"

interface CardStepProps {
  data: PaymentData & { cardholderName?: string; cardNumber?: string; expiryDate?: string; cvv?: string }
  onNext: (stepData: any) => void
  onBack: () => void
}

export function CardStep({ data, onNext, onBack }: CardStepProps) {
  const [cardData, setCardData] = useState({
    cardholderName: data.cardholderName || "",
    cardNumber: data.cardNumber || "",
    expiryDate: data.expiryDate || "",
    cvv: data.cvv || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "Le nom du titulaire est requis"
    }

    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis"
    } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Le numéro de carte doit contenir 16 chiffres"
    }

    if (!cardData.expiryDate.trim()) {
      newErrors.expiryDate = "La date d'expiration est requise"
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Format MM/YY requis"
    }

    if (!cardData.cvv.trim()) {
      newErrors.cvv = "Le CVV est requis"
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "Le CVV doit contenir 3 ou 4 chiffres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    } else if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(\d{2})/, "$1/$2")
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleNext = async () => {
    if (validateForm()) {
      setIsLoading(true)
      // Just pass card data to next step for processing
      onNext({
        ...cardData,
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations de paiement</h2>
        <p className="text-gray-600">Entrez les détails de votre carte bancaire</p>
      </div>

      {/* Card Preview */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg h-44 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs opacity-75 mb-1">Numéro de carte</p>
            <p className="text-lg tracking-widest font-mono">{cardData.cardNumber || "•••• •••• •••• ••••"}</p>
          </div>
          <div className="text-2xl font-bold">CARD</div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-75">Titulaire</p>
            <p className="text-sm font-semibold uppercase tracking-wide">
              {cardData.cardholderName || "NOM TITULAIRE"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">Exp</p>
            <p className="text-sm font-mono font-semibold">{cardData.expiryDate || "MM/YY"}</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-semibold text-gray-700 mb-2">
            Nom du titulaire
          </label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            value={cardData.cardholderName}
            onChange={handleChange}
            placeholder="Jean Dupont"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.cardholderName ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.cardholderName && <p className="text-sm text-red-600 mt-1">{errors.cardholderName}</p>}
        </div>

        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Numéro de carte
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={cardData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors font-mono ${
              errors.cardNumber ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.cardNumber && <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Date d'expiration
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              value={cardData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors font-mono ${
                errors.expiryDate ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.expiryDate && <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>}
          </div>

          <div>
            <label htmlFor="cvv" className="block text-sm font-semibold text-gray-700 mb-2">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              value={cardData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength={4}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors font-mono ${
                errors.cvv ? "border-red-500 focus:border-red-600" : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {errors.cvv && <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Votre paiement est sécurisé et crypté
      </div>

      {/* Submission Errors */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Retour
        </button>
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          {isLoading ? "Traitement..." : "Continuer"}
        </button>
      </div>
    </div>
  )
}
