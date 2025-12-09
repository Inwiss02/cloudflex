"use client"

import { useState, useEffect } from "react"
import { EmailStep } from "./steps/email-step"
import { PlanStep } from "./steps/plan-step"
import { PaymentMethodStep } from "./steps/payment-method-step"
import { CardStep } from "./steps/card-step"
import { CryptoStep } from "./steps/crypto-step"
import { SummaryStep } from "./steps/summary-step"
import { StepIndicator } from "./step-indicator"
import { CryptoConfirmationStep } from "./steps/crypto-confirmation-step"
import { CardConfirmationStep } from "./steps/card-confirmation-step"
import { CashConfirmationStep } from "./steps/cash-confirmation-step"

export type PaymentStep =
  | "email"
  | "plan"
  | "payment-method"
  | "card"
  | "crypto"
  | "cash"
  | "summary"
  | "crypto-confirmation"
  | "card-confirmation"
  | "cash-confirmation"

export type PaymentMethod = "card" | "crypto" | "cash" | null

export interface PaymentData {
  email: string
  plan: "semestre" | "annuel" | "2ans" | null
  selectedPlan?: { name: string; price: number; duration: string }
  paymentMethod: PaymentMethod
  cardholderName?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cryptoCurrency?: string
  cryptoNetwork?: string
  orderNumber?: string
  subscriptionId?: string
}

interface PaymentFlowProps {
  initialEmail?: string
}

export function PaymentFlow({ initialEmail }: PaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("email")
  const [cardPaymentStatus, setCardPaymentStatus] = useState<"processing" | "success" | "error" | null>(null)
  const [cardErrorMessage, setCardErrorMessage] = useState<string>("")
  const [data, setData] = useState<PaymentData>({
    email: "",
    plan: null,
    paymentMethod: null,
  })

  useEffect(() => {
    if (initialEmail && !data.email) {
      setData((prev) => ({ ...prev, email: initialEmail }))
      if (initialEmail.includes("@")) {
        setCurrentStep("plan")
      }
    }
  }, [initialEmail])

  const handleNext = (stepData: Partial<PaymentData>) => {
    setData((prev) => ({ ...prev, ...stepData }))

    if (currentStep === "email") {
      setCurrentStep("plan")
    } else if (currentStep === "plan") {
      setCurrentStep("payment-method")
    } else if (currentStep === "payment-method") {
      if (stepData.paymentMethod === "card") {
        setCurrentStep("card")
      } else if (stepData.paymentMethod === "crypto") {
        setCurrentStep("crypto")
      } else if (stepData.paymentMethod === "cash") {
        setCurrentStep("cash-confirmation")
      }
    } else if (currentStep === "card") {
      setCurrentStep("card-confirmation")
      setCardPaymentStatus("processing")
    } else if (currentStep === "crypto") {
      setCurrentStep("crypto-confirmation")
    }
  }

  const handleRetryCardPayment = () => {
    setCardPaymentStatus(null)
    setCardErrorMessage("")
    setCurrentStep("card")
  }

  const handleBack = () => {
    if (currentStep === "plan") {
      setCurrentStep("email")
    } else if (currentStep === "payment-method") {
      setCurrentStep("plan")
    } else if (currentStep === "card") {
      setCurrentStep("payment-method")
    } else if (currentStep === "crypto") {
      setCurrentStep("payment-method")
    } else if (currentStep === "summary") {
      if (data.paymentMethod === "card") {
        setCurrentStep("card")
      } else if (data.paymentMethod === "crypto") {
        setCurrentStep("crypto")
      }
    } else if (currentStep === "card-confirmation") {
      if (cardPaymentStatus === "error") {
        setCurrentStep("card")
      }
    } else if (currentStep === "crypto-confirmation") {
      setCurrentStep("crypto")
    } else if (currentStep === "cash-confirmation") {
      setCurrentStep("payment-method")
    }
  }

  const steps = [
    { id: "email", label: "Email", number: 1 },
    { id: "plan", label: "Plan", number: 2 },
    { id: "payment-method", label: "Méthode", number: 3 },
    { id: "card", label: "Carte", number: 4, hidden: data.paymentMethod !== "card" },
    { id: "crypto", label: "Crypto", number: 4, hidden: data.paymentMethod !== "crypto" },
    { id: "cash", label: "Espèce", number: 4, hidden: data.paymentMethod !== "cash" },
    { id: "summary", label: "Récapitulatif", number: 5 },
  ].filter((step) => !step.hidden)

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {!["crypto-confirmation", "card-confirmation", "cash-confirmation"].includes(currentStep) && (
          <StepIndicator steps={steps} currentStep={currentStep} />
        )}

        <div className="mt-8">
          {currentStep === "email" && <EmailStep data={data} onNext={handleNext} />}
          {currentStep === "plan" && <PlanStep data={data} onNext={handleNext} onBack={handleBack} />}
          {currentStep === "payment-method" && (
            <PaymentMethodStep data={data} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === "card" && <CardStep data={data} onNext={handleNext} onBack={handleBack} />}
          {currentStep === "crypto" && <CryptoStep data={data} onNext={handleNext} onBack={handleBack} />}
          {currentStep === "summary" && <SummaryStep data={data} onBack={handleBack} />}
          {currentStep === "crypto-confirmation" && <CryptoConfirmationStep data={data} />}
          {currentStep === "card-confirmation" && (
            <CardConfirmationStep
              data={data}
              status={cardPaymentStatus}
              errorMessage={cardErrorMessage}
              onRetry={handleRetryCardPayment}
              onStatusChange={setCardPaymentStatus}
              onErrorChange={setCardErrorMessage}
            />
          )}
          {currentStep === "cash-confirmation" && <CashConfirmationStep data={data} />}
        </div>
      </div>
    </div>
  )
}
