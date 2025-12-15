"use client";

interface StepIndicatorProps {
  steps: Array<{ id: string; label: string; number: number }>;
  currentStep: string;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted =
          steps.findIndex((s) => s.id === currentStep) > index;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            {/* Circle */}
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${
                isActive || isCompleted
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>

            {/* Label - Hidden on very small screens, visible on sm+ */}
            <div className="ml-2 sm:ml-3 hidden sm:block">
              <p
                className={`text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  isActive || isCompleted ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 min-w-[20px] ${
                  isCompleted ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
