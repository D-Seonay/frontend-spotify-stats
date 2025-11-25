"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { BarChart3, Share2, Clock, TrendingUp, Music, Users, Zap, Shield } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: BarChart3,
    title: "Analyses détaillées",
    description:
      "Visualise tes habitudes d'écoute avec des graphiques interactifs et des statistiques approfondies sur tes artistes, albums et titres préférés.",
  },
  {
    icon: TrendingUp,
    title: "Tendances d'écoute",
    description:
      "Suis l'évolution de tes goûts musicaux au fil du temps. Découvre comment ton style évolue semaine après semaine.",
  },
  {
    icon: Clock,
    title: "Historique complet",
    description:
      "Accède à ton historique d'écoute sur différentes périodes : dernières 4 semaines, 6 mois, ou depuis toujours.",
  },
  {
    icon: Share2,
    title: "Partage social",
    description: "Génère des visuels attrayants de tes stats et partage-les sur tes réseaux sociaux en un clic.",
  },
  {
    icon: Music,
    title: "Découverte musicale",
    description:
      "Reçois des recommandations personnalisées basées sur tes habitudes d'écoute et découvre de nouveaux artistes.",
  },
  {
    icon: Users,
    title: "Comparaison entre amis",
    description: "Compare tes stats avec celles de tes amis et découvre ce que vous avez en commun.",
  },
  {
    icon: Zap,
    title: "Mises à jour en temps réel",
    description: "Tes statistiques se mettent à jour automatiquement pour refléter tes dernières écoutes.",
  },
  {
    icon: Shield,
    title: "Confidentialité garantie",
    description: "Tes données restent les tiennes. Nous ne vendons jamais tes informations personnelles.",
  },
]

export default function FeaturesPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Des <span className="text-[#1DB954]">fonctionnalités</span> puissantes
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Explore toutes les fonctionnalités qui font de Spotify Listener Stats l'outil ultime pour comprendre et
            partager tes habitudes musicales.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-white/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1DB954]/20 text-[#1DB954] transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à découvrir tes stats ?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Connecte-toi avec ton compte Spotify et commence à explorer tes statistiques d'écoute dès maintenant.
          </p>
          <Link href="/login">
            <Button className="rounded-full bg-[#1DB954] px-8 py-6 text-lg text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
