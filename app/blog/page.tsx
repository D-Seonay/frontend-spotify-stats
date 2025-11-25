"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    title: "Comment exploiter au maximum tes statistiques Spotify",
    excerpt: "Découvre les meilleures pratiques pour analyser et comprendre tes habitudes d'écoute musicale.",
    category: "Tutoriel",
    date: "22 Nov 2025",
    readTime: "5 min",
    slug: "exploiter-statistiques-spotify",
  },
  {
    title: "Les tendances musicales de 2025",
    excerpt: "Une analyse approfondie des genres et artistes qui ont dominé cette année selon nos données.",
    category: "Analyse",
    date: "18 Nov 2025",
    readTime: "8 min",
    slug: "tendances-musicales-2025",
  },
  {
    title: "Nouveau : Comparaison entre amis",
    excerpt: "Nous lançons une nouvelle fonctionnalité qui te permet de comparer tes goûts musicaux avec tes amis.",
    category: "Nouveauté",
    date: "15 Nov 2025",
    readTime: "3 min",
    slug: "comparaison-amis",
  },
  {
    title: "La science derrière tes goûts musicaux",
    excerpt: "Pourquoi aimons-nous certaines musiques ? Une exploration des mécanismes psychologiques en jeu.",
    category: "Science",
    date: "10 Nov 2025",
    readTime: "10 min",
    slug: "science-gouts-musicaux",
  },
  {
    title: "Guide complet : Créer des visuels de partage",
    excerpt: "Apprends à générer et personnaliser des visuels parfaits pour partager tes stats sur les réseaux.",
    category: "Tutoriel",
    date: "5 Nov 2025",
    readTime: "6 min",
    slug: "guide-visuels-partage",
  },
  {
    title: "Interview : Comment la data change l'industrie musicale",
    excerpt: "Rencontre avec un expert de l'industrie sur l'impact des données d'écoute sur la musique moderne.",
    category: "Interview",
    date: "1 Nov 2025",
    readTime: "12 min",
    slug: "interview-data-industrie-musicale",
  },
]

const categories = ["Tous", "Tutoriel", "Analyse", "Nouveauté", "Science", "Interview"]

export default function BlogPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Notre <span className="text-[#1DB954]">Blog</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Actualités, tutoriels et analyses sur l'univers de la musique et des statistiques d'écoute.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  index === 0
                    ? "bg-[#1DB954] text-black"
                    : "border border-white/20 text-gray-300 hover:border-[#1DB954] hover:text-[#1DB954]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-white/10"
              >
                <div className="aspect-video bg-gradient-to-br from-[#1DB954]/20 to-transparent" />
                <div className="p-6">
                  <span className="inline-block rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#1DB954] mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#1DB954] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#1DB954] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Reste informé</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Inscris-toi à notre newsletter pour recevoir nos derniers articles et actualités.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="ton@email.com"
              className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-white placeholder:text-gray-500 focus:border-[#1DB954] focus:outline-none"
            />
            <Button className="rounded-full bg-[#1DB954] px-6 text-black font-semibold transition-all hover:bg-[#1ed760]">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
