"use client"

import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"

export default function CookiesPage() {
  return (
    <PageLayout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Politique de cookies</h1>
            <p className="text-gray-400 mb-12">Dernière mise à jour : 25 novembre 2025</p>

            <div className="prose prose-invert prose-green max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">1. Qu'est-ce qu'un cookie ?</h2>
                <p className="text-gray-300 leading-relaxed">
                  Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. Les
                  cookies nous aident à faire fonctionner le site, à le rendre plus sûr, à fournir une meilleure
                  expérience utilisateur et à comprendre comment le site fonctionne.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">2. Types de cookies utilisés</h2>

                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold text-[#1DB954] mb-2">Cookies essentiels</h3>
                    <p className="text-sm text-gray-300">
                      Nécessaires au fonctionnement du site. Ils permettent l'authentification et la sécurité de votre
                      session.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold text-[#1DB954] mb-2">Cookies de performance</h3>
                    <p className="text-sm text-gray-300">
                      Nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant des
                      informations anonymes.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold text-[#1DB954] mb-2">Cookies fonctionnels</h3>
                    <p className="text-sm text-gray-300">
                      Permettent de mémoriser vos préférences et personnaliser votre expérience sur le site.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies tiers</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Nous utilisons les services tiers suivants qui peuvent placer des cookies :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    <strong>Spotify</strong> - Pour l'authentification OAuth
                  </li>
                  <li>
                    <strong>Vercel Analytics</strong> - Pour les statistiques anonymes du site
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">4. Gestion des cookies</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous
                  les cookies déjà présents sur votre appareil et configurer la plupart des navigateurs pour empêcher
                  leur installation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760]">
                    Accepter tous les cookies
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 hover:border-[#1DB954] hover:text-[#1DB954] bg-transparent"
                  >
                    Personnaliser
                  </Button>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">5. Durée de conservation</h2>
                <p className="text-gray-300 leading-relaxed">
                  Les cookies de session sont supprimés lorsque vous fermez votre navigateur. Les cookies persistants
                  restent sur votre appareil pendant une durée définie ou jusqu'à ce que vous les supprimiez
                  manuellement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">6. Contact</h2>
                <p className="text-gray-300 leading-relaxed">
                  Pour toute question concernant notre utilisation des cookies, contactez-nous à :{" "}
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
