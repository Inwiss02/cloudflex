"use client";

import { useState } from "react";
import type { PaymentData } from "../payment-flow";
import { PlanCard } from "../plan-card";

interface PlanStepProps {
  data: PaymentData;
  onNext: (data: Partial<PaymentData>) => void;
  onBack: () => void;
}

export function PlanStep({ data, onNext, onBack }: PlanStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<
    "semestre" | "annuel" | "2ans" | null
  >(data.plan);
  const [error, setError] = useState("");

  const plans = [
    {
      id: "semestre",
      name: "Semestre",
      price: 60,
      priceUSD: 5.75,
      description: "Abonnement de 6 mois - Facturé en un seul paiement",

      features: [
        "Accès illimité",
        "Support prioritaire",
        "Renouvellement facile",
      ],
      highlight: false,
    },
    {
      id: "annuel",
      name: "12 mois",
      price: 50,
      priceUSD: 5.2,
      description: "Abonnement d'1 an - Facturé en un seul paiement",

      features: ["Accès illimité", "Support prioritaire", "Économisez 17%"],
      highlight: true,
    },
    {
      id: "2ans",
      name: "24 mois",
      price: 40,
      priceUSD: 4.5,
      description: "Abonnement de 2 ans - Facturé en un seul paiement",

      features: ["Accès illimité", "Support prioritaire", "Économisez 33%"],
      highlight: false,
    },
  ];

  const handleNext = () => {
    if (!selectedPlan) {
      setError("Veuillez sélectionner un plan");
      return;
    }
    setError("");
    const plan = plans.find((p) => p.id === selectedPlan);
    onNext({
      plan: selectedPlan,
      selectedPlan: {
        name: plan!.name,
        price: plan!.price * 12,
        duration: selectedPlan,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisir votre plan
        </h2>
        <p className="text-gray-600">
          Sélectionnez la durée d'abonnement qui vous convient
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => {
              setSelectedPlan(plan.id as "semestre" | "annuel" | "2ans");
              setError("");
            }}
          />
        ))}
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Retour
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
