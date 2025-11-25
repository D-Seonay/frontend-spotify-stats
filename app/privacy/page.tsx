"use client"

import PageLayout from "@/components/PageLayout"

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Politique de confidentialité</h1>
            <p className="text-gray-400 mb-12">Dernière mise à jour : 25 novembre 2025</p>

            <div className="prose prose-invert prose-green max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                <p className="text-gray-300 leading-relaxed">
                  Bienvenue sur Spotify Listener Stats. Nous respectons votre vie privée et nous engageons à protéger
                  vos données personnelles. Cette politique de confidentialité vous informe sur la façon dont nous
                  traitons vos données personnelles lorsque vous utilisez notre service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">2. Données collectées</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous collectons les données suivantes via l'API Spotify :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Votre nom d'utilisateur et photo de profil Spotify</li>
                  <li>Vos artistes et titres les plus écoutés</li>
                  <li>Votre historique d'écoute récent</li>
                  <li>Vos playlists publiques</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">3. Utilisation des données</h2>
                <p className="text-gray-300 leading-relaxed">
                  Vos données sont utilisées exclusivement pour vous fournir des statistiques personnalisées sur vos
                  habitudes d'écoute. Nous n'utilisons pas vos données à des fins publicitaires et ne les vendons jamais
                  à des tiers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">4. Stockage et sécurité</h2>
                <p className="text-gray-300 leading-relaxed">
                  Vos données sont stockées de manière sécurisée sur des serveurs protégés. Nous utilisons le
                  chiffrement SSL/TLS pour toutes les communications et appliquons les meilleures pratiques de sécurité
                  de l'industrie.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">5. Vos droits</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification de vos données</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit à la portabilité de vos données</li>
                  <li>Droit de retirer votre consentement à tout moment</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">6. Contact</h2>
                <p className="text-gray-300 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                  contactez-nous à :{" "}
                  <a href="mailto:privacy@spotifylistenerstats.com" className="text-[#1DB954] hover:underline">
                    privacy@spotifylistenerstats.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
