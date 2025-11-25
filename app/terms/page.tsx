"use client"

import PageLayout from "@/components/PageLayout"

export default function TermsPage() {
  return (
    <PageLayout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Conditions d'utilisation</h1>
            <p className="text-gray-400 mb-12">Dernière mise à jour : 25 novembre 2025</p>

            <div className="prose prose-invert prose-green max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptation des conditions</h2>
                <p className="text-gray-300 leading-relaxed">
                  En accédant et en utilisant Spotify Listener Stats, vous acceptez d'être lié par ces conditions
                  d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">2. Description du service</h2>
                <p className="text-gray-300 leading-relaxed">
                  Spotify Listener Stats est un service qui vous permet de visualiser et partager vos statistiques
                  d'écoute Spotify. Notre service utilise l'API officielle de Spotify et n'est pas affilié, sponsorisé
                  ou approuvé par Spotify AB.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">3. Compte utilisateur</h2>
                <p className="text-gray-300 leading-relaxed">
                  Pour utiliser notre service, vous devez vous connecter avec votre compte Spotify. Vous êtes
                  responsable de maintenir la confidentialité de vos informations de connexion et de toutes les
                  activités qui se produisent sous votre compte.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">4. Utilisation acceptable</h2>
                <p className="text-gray-300 leading-relaxed mb-4">Vous acceptez de ne pas :</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Utiliser le service à des fins illégales</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Collecter des données d'autres utilisateurs sans autorisation</li>
                  <li>Utiliser des bots ou scripts automatisés</li>
                  <li>Revendre ou redistribuer notre service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">5. Propriété intellectuelle</h2>
                <p className="text-gray-300 leading-relaxed">
                  Tout le contenu, les fonctionnalités et la fonctionnalité de Spotify Listener Stats sont la propriété
                  exclusive de notre entreprise et sont protégés par les lois sur le droit d'auteur et la propriété
                  intellectuelle.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitation de responsabilité</h2>
                <p className="text-gray-300 leading-relaxed">
                  Notre service est fourni "tel quel" sans garantie d'aucune sorte. Nous ne serons pas responsables des
                  dommages directs, indirects, accessoires ou consécutifs résultant de l'utilisation ou de
                  l'impossibilité d'utiliser notre service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">7. Modifications</h2>
                <p className="text-gray-300 leading-relaxed">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en
                  vigueur dès leur publication sur cette page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact</h2>
                <p className="text-gray-300 leading-relaxed">
                  Pour toute question concernant ces conditions, contactez-nous à :{" "}
                  <a href="mailto:legal@spotifylistenerstats.com" className="text-[#1DB954] hover:underline">
                    legal@spotifylistenerstats.com
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
