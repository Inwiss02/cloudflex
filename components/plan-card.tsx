"use client";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
    paymentNote?: string;
    features: string[];
    highlight: boolean;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-300 transform hover:scale-105
        ${
          isSelected
            ? "border-blue-600 bg-blue-50 shadow-lg"
            : "border-gray-200 bg-white hover:border-blue-400"
        }
        ${plan.highlight ? "md:scale-105" : ""}
        text-center
      `}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
          BEST VALUE
        </div>
      )}

      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>

      {/* Description plus petite */}
      <p className="text-xs text-gray-600 mb-1">{plan.description}</p>

      {/* Note facturation encore plus petite */}
      {plan.paymentNote && (
        <p className="text-[11px] text-gray-500 mb-4">{plan.paymentNote}</p>
      )}

      {/* Prix */}
      <div className="mb-6">
        <div className="flex items-baseline justify-center">
          <span className="text-xl font-bold text-gray-900">{plan.price}</span>
          <span className="text-sm font-medium text-gray-600 ml-1">
            MAD / mois
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 text-left">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
