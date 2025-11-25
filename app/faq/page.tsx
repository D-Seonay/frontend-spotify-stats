"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment Spotify Listener Stats accède-t-il à mes données ?",
    answer:
      "Nous utilisons l'API officielle de Spotify avec le protocole OAuth 2.0. Tu autorises notre application à accéder à tes données d'écoute de manière sécurisée. Nous n'avons jamais accès à ton mot de passe Spotify.",
  },
  {
    question: "Mes données sont-elles en sécurité ?",
    answer:
      "Absolument. Nous ne stockons que les données nécessaires au fonctionnement du service. Tes données ne sont jamais vendues à des tiers et tu peux demander leur suppression à tout moment.",
  },
  {
    question: "Puis-je utiliser le service gratuitement ?",
    answer:
      "Oui ! Notre plan gratuit te donne accès à tes top 10 artistes et titres, ainsi qu'aux statistiques des 4 dernières semaines. C'est parfait pour découvrir le service.",
  },
  {
    question: "Comment annuler mon abonnement Pro ?",
    answer:
      "Tu peux annuler ton abonnement à tout moment depuis les paramètres de ton compte. L'annulation prend effet à la fin de la période de facturation en cours.",
  },
  {
    question: "Les statistiques sont-elles mises à jour en temps réel ?",
    answer:
      "Les statistiques sont synchronisées avec Spotify plusieurs fois par jour. Tes dernières écoutes apparaissent généralement dans l'heure qui suit.",
  },
  {
    question: "Puis-je partager mes statistiques ?",
    answer:
      "Bien sûr ! Tu peux générer des visuels attrayants de tes stats et les partager directement sur Instagram, Twitter, ou toute autre plateforme.",
  },
  {
    question: "Le service fonctionne-t-il avec Spotify Free ?",
    answer: "Oui, Spotify Listener Stats fonctionne avec tous les comptes Spotify, qu'ils soient gratuits ou Premium.",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Tu peux nous contacter via le formulaire de contact sur notre site, ou directement par email à support@spotifylistenerstats.com.",
  },
]

export default function FAQPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Questions <span className="text-[#1DB954]">fréquentes</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            Tu as des questions ? Nous avons les réponses. Parcours notre FAQ pour trouver ce que tu cherches.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 px-6 data-[state=open]:border-[#1DB954]/50"
              >
                <AccordionTrigger className="text-left hover:no-underline hover:text-[#1DB954] py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Tu n'as pas trouvé ta réponse ?</h2>
          <p className="text-gray-400 mb-6">Notre équipe est là pour t'aider.</p>
          <Button className="rounded-full bg-[#1DB954] px-8 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105">
            Contacter le support
          </Button>
        </div>
      </section>
    </PageLayout>
  )
}
