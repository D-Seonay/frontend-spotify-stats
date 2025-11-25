"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Music, Users, Heart, Target } from "lucide-react"
import Link from "next/link"

const values = [
  {
    icon: Music,
    title: "Passion pour la musique",
    description: "La musique est au cœur de tout ce que nous faisons. Nous croyons qu'elle mérite d'être célébrée.",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Nous construisons pour les fans de musique, par des fans de musique.",
  },
  {
    icon: Heart,
    title: "Transparence",
    description: "Tes données t'appartiennent. Nous sommes clairs sur ce que nous collectons et pourquoi.",
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Nous repoussons constamment les limites pour t'offrir la meilleure expérience possible.",
  },
]

const team = [
  { name: "Marie Laurent", role: "CEO & Co-fondatrice", avatar: "M" },
  { name: "Thomas Dubois", role: "CTO & Co-fondateur", avatar: "T" },
  { name: "Sophie Martin", role: "Head of Design", avatar: "S" },
  { name: "Lucas Bernard", role: "Lead Developer", avatar: "L" },
]

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            À propos de <span className="text-[#1DB954]">nous</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Nous sommes une équipe de passionnés de musique qui croit que chaque écoute raconte une histoire.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Notre mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Spotify Listener Stats est né d'une idée simple : permettre à chaque amateur de musique de mieux
              comprendre et partager ses habitudes d'écoute. Nous croyons que la musique est personnelle et que tes
              statistiques méritent d'être célébrées. Notre objectif est de te donner les outils pour explorer, analyser
              et partager ton univers musical de manière unique et engageante.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-[#1DB954]/50"
              >
                <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#1DB954]/20 text-[#1DB954]">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre équipe</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-[#1DB954]/50"
              >
                <div className="mb-4 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954] text-2xl font-bold text-black">
                  {member.avatar}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoins l'aventure</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Découvre tes statistiques d'écoute et fais partie de notre communauté grandissante.
          </p>
          <Link href="/login">
            <Button className="rounded-full bg-[#1DB954] px-8 py-6 text-lg text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
