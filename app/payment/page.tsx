"use client";

import { PaymentFlow } from "@/components/payment-flow";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [initialEmail, setInitialEmail] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setInitialEmail(email);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Mobile: Menu déroulant, Desktop: Boutons */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        {/* Desktop Buttons */}
        <div className="hidden sm:flex gap-3">
          <Link href="/support">
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-md transition-all duration-200 border border-gray-200 text-sm md:text-base">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="hidden md:inline">Support</span>
            </button>
          </Link>
          <Link href="/mon-compte">
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-md transition-all duration-200 border border-gray-200 text-sm md:text-base">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden md:inline">Mon Compte</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <select
            onChange={(e) => {
              if (e.target.value) window.location.href = e.target.value;
            }}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 shadow-md"
          >
            <option value="">Menu</option>
            <option value="/support">Support</option>
            <option value="/mon-compte">Mon Compte</option>
          </select>
        </div>
      </div>
      <PaymentFlow initialEmail={initialEmail} />
    </main>
  );
}
