"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, ArrowRight } from "lucide-react"

const jobs = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Paris, France (Hybride)",
    type: "CDI",
    description:
      "Rejoins notre équipe pour construire des interfaces utilisateur exceptionnelles avec React et Next.js.",
  },
  {
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote (EU)",
    type: "CDI",
    description:
      "Développe et maintiens nos APIs et infrastructure backend pour supporter des millions d'utilisateurs.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Paris, France (Hybride)",
    type: "CDI",
    description: "Crée des expériences utilisateur innovantes et engageantes pour notre plateforme.",
  },
  {
    title: "Data Analyst",
    department: "Data",
    location: "Remote (EU)",
    type: "CDI",
    description: "Analyse les données d'utilisation pour améliorer notre produit et comprendre nos utilisateurs.",
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Paris, France",
    type: "CDI",
    description: "Anime et développe notre communauté sur les réseaux sociaux et autres canaux.",
  },
]

const perks = [
  "Travail flexible (hybride/remote)",
  "Équipement de travail fourni",
  "Tickets restaurant",
  "Mutuelle premium",
  "Congés illimités",
  "Budget formation",
  "Spotify Premium offert",
  "Team buildings réguliers",
]

export default function CareersPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Rejoins notre <span className="text-[#1DB954]">équipe</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Nous recherchons des personnes passionnées pour nous aider à révolutionner la façon dont les gens découvrent
            et partagent leur musique.
          </p>
        </div>
      </section>

      {/* Perks Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Pourquoi nous rejoindre ?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {perks.map((perk, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm transition-all hover:border-[#1DB954]/50"
              >
                {perk}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Postes ouverts</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#1DB954]">
                        {job.department}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#1DB954] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Button className="rounded-full bg-[#1DB954] text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105 flex items-center gap-2">
                    Postuler
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Tu ne trouves pas ton poste idéal ?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Envoie-nous une candidature spontanée, nous sommes toujours à la recherche de talents.
          </p>
          <Button className="rounded-full bg-[#1DB954] px-8 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105">
            Candidature spontanée
          </Button>
        </div>
      </section>
    </PageLayout>
  )
}
