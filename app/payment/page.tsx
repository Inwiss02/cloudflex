"use client"

import { PaymentFlow } from "@/components/payment-flow"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [initialEmail, setInitialEmail] = useState("")

  useEffect(() => {
    const email = searchParams.get("email")
    if (email) {
      setInitialEmail(email)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6 flex gap-3">
        <Link href="/support">
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 border border-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Support
          </button>
        </Link>
        <Link href="/mon-compte">
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 border border-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Mon Compte
          </button>
        </Link>
      </div>
      <PaymentFlow initialEmail={initialEmail} />
    </main>
  )
}
