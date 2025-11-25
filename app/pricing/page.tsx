"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "pour toujours",
    description: "Parfait pour découvrir tes stats de base.",
    features: [
      "Top 10 artistes et titres",
      "Statistiques des 4 dernières semaines",
      "Partage basique sur les réseaux",
      "1 visuel par mois",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    price: "4,99€",
    period: "/mois",
    description: "Pour les vrais passionnés de musique.",
    features: [
      "Top 50 artistes et titres",
      "Historique complet (4 sem, 6 mois, all-time)",
      "Visuels illimités et personnalisables",
      "Analyses détaillées par genre",
      "Comparaison avec tes amis",
      "Export de données",
    ],
    cta: "Essayer Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "9,99€",
    period: "/mois",
    description: "Parfait pour les groupes et créateurs.",
    features: [
      "Tout ce qui est inclus dans Pro",
      "Jusqu'à 5 comptes",
      "Statistiques de groupe",
      "API access",
      "Support prioritaire",
      "Intégrations personnalisées",
    ],
    cta: "Contacter les ventes",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Des <span className="text-[#1DB954]">tarifs</span> simples et transparents
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Choisis le plan qui correspond à tes besoins. Commence gratuitement et passe à la vitesse supérieure quand
            tu le souhaites.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-[#1DB954] bg-[#1DB954]/10 scale-105"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1DB954] px-4 py-1 text-sm font-semibold text-black">
                    Le plus populaire
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-[#1DB954] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button
                    className={`w-full rounded-full font-semibold transition-all ${
                      plan.popular
                        ? "bg-[#1DB954] text-black hover:bg-[#1ed760]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Des questions ?</h2>
          <p className="text-gray-400 mb-6">Consulte notre FAQ ou contacte-nous directement.</p>
          <Link href="/faq">
            <Button
              variant="outline"
              className="rounded-full border-white/20 hover:border-[#1DB954] hover:text-[#1DB954] bg-transparent"
            >
              Voir la FAQ
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
