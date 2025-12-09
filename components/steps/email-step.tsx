"use client"

import { useState, useEffect } from "react"
import type { PaymentData } from "../payment-flow"

interface EmailStepProps {
  data: PaymentData
  onNext: (data: Partial<PaymentData>) => void
}

export function EmailStep({ data, onNext }: EmailStepProps) {
  const [email, setEmail] = useState(data.email)
  const [error, setError] = useState("")

  useEffect(() => {
    if (data.email && data.email !== email) {
      setEmail(data.email)
    }
  }, [data.email])

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleNext = () => {
    if (!email.trim()) {
      setError("Veuillez entrer votre email")
      return
    }
    if (!validateEmail(email)) {
      setError("Veuillez entrer un email valide")
      return
    }
    setError("")
    onNext({ email })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre email</h2>
        <p className="text-gray-600">Entrez votre adresse email pour commencer</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError("")
          }}
          onKeyPress={(e) => e.key === "Enter" && handleNext()}
          placeholder="vous@exemple.com"
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none ${
            error
              ? "border-red-500 focus:border-red-600 bg-red-50"
              : "border-gray-300 focus:border-blue-500 focus:bg-blue-50"
          }`}
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        Continuer
      </button>
    </div>
  )
}
