"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    email: "",
    objet: "",
    criticite: "moyenne",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/send-support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ email: "", objet: "", criticite: "moyenne", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error sending support request:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Support CloudFlex</h1>
          <p className="text-gray-400">Nous sommes là pour vous aider</p>
        </div>

        {/* Form */}
        <section className="max-w-3xl mx-auto bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Votre Email</label>
              <input
                type="email"
                placeholder="exemple@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:border-blue-400 outline-none text-white placeholder:text-gray-500 transition-colors"
              />
            </div>

            {/* Objet */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Objet</label>
              <select
                required
                value={formData.objet}
                onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:border-blue-400 outline-none text-white transition-colors"
              >
                <option value="" disabled>
                  Choisissez un objet
                </option>
                <option>Problème d'accès à Plex</option>
                <option>Problème d'accès à Overseerr</option>
                <option>Films ou séries demandés non disponibles</option>
                <option>Lectures ou streaming qui ne fonctionnent pas</option>
                <option>Problème de lecture ou de qualité vidéo / audio / Sous titre</option>
                <option>Gestion des profils dans votre espace Plex</option>
                <option>Questions sur le catalogue (films, séries, anime, enfants)</option>
                <option>Facturation et gestion et renouvellement des abonnements</option>
                <option>Suggestions d'amélioration</option>
                <option>Autres (à préciser)</option>
              </select>
            </div>

            {/* Criticité */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Criticité</label>
              <select
                value={formData.criticite}
                onChange={(e) => setFormData({ ...formData, criticite: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:border-blue-400 outline-none text-white transition-colors"
              >
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Message</label>
              <textarea
                rows={6}
                placeholder="Décrivez votre problème ou demande..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg focus:border-blue-400 outline-none text-white placeholder:text-gray-500 resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </Button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="p-6 bg-green-500/20 border-2 border-green-500/50 rounded-xl text-center animate-fade-in space-y-3">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-400 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-green-300">Merci pour votre message !</h3>
                <p className="text-green-200">
                  Votre réclamation a été enregistrée avec succès. Notre équipe vous répondra dans les plus brefs délais
                  à l'adresse email fournie.
                </p>
                <p className="text-sm text-green-300/80">Vous recevrez une confirmation par email sous peu.</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center animate-fade-in">
                Une erreur est survenue. Veuillez réessayer.
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  )
}
