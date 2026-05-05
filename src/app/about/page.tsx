import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/data';

export const metadata: Metadata = {
  title: 'À propos — Notre charte et méthode de test',
  description:
    "Qui sommes-nous, comment nous testons les outils IA pendant 30 jours, notre charte d'indépendance, mentions légales, cookies et contact.",
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'article',
    title: `À propos | ${SITE_NAME}`,
    description: "Charte éditoriale, méthode de test 30 jours, indépendance.",
    url: `${SITE_URL}/about`,
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${SITE_URL}/about#aboutpage`,
  url: `${SITE_URL}/about`,
  name: `À propos de ${SITE_NAME}`,
  description: 'Charte éditoriale, méthode de test, indépendance et mentions légales.',
  mainEntity: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'fr-FR',
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <section className="pt-[calc(72px+3rem)] pb-12">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <span className="eyebrow block mb-3">À propos</span>
            <h1 className="heading-display text-[clamp(2.4rem,5vw,4rem)] mb-6">
              La <span className="italic text-gold">référence</span> indépendante des outils IA en français
            </h1>
            <p className="lead">
              TopOutils.IA est un projet éditorial indépendant qui teste, compare et recommande les meilleurs outils
              d'intelligence artificielle disponibles en français.
            </p>
          </div>

          <article className="article-prose">
            <h2>Notre mission</h2>
            <p>
              L'IA générative explose : des dizaines d'outils sortent chaque mois, chacun promettant la révolution. Le
              bruit est immense, l'information souvent biaisée par les programmes d'affiliation. <strong>Notre
              mission</strong> est simple : produire les comparatifs les plus honnêtes, les plus complets et les plus
              utiles du web francophone.
            </p>

            <h2>Comment nous testons</h2>
            <p>
              Chaque outil que nous comparons est testé pendant au moins <strong>30 jours d'utilisation réelle</strong>{' '}
              sur des cas d'usage représentatifs. Nous évaluons sept critères :
            </p>
            <ul>
              <li><strong>Qualité brute</strong> du résultat produit</li>
              <li><strong>Facilité d'usage</strong> et courbe d'apprentissage</li>
              <li><strong>Rapport qualité-prix</strong> sur les plans courants</li>
              <li><strong>Support du français</strong> (interface et qualité linguistique)</li>
              <li><strong>Qualité de l'API</strong> et écosystème développeur</li>
              <li><strong>Fiabilité</strong> et uptime observé</li>
              <li><strong>Note globale</strong> synthétique</li>
            </ul>

            <h2>Notre indépendance</h2>
            <p>
              Oui, nous percevons des commissions d'affiliation lorsque vous souscrivez à un outil via nos liens. Mais
              nous tenons à une règle absolue : <strong>aucune marque ne peut acheter une bonne note ou une
              recommandation</strong>. Notre crédibilité long-terme dépend de notre honnêteté. Si un outil est
              médiocre, nous le disons. Si un concurrent moins rentable pour nous est meilleur, nous le recommandons
              quand même.
            </p>

            <h2 id="contact">Contact</h2>
            <p>
              Une suggestion d'outil à comparer ? Une erreur factuelle à signaler ? Un partenariat éditorial sérieux ?
              Écrivez-nous à <Link href="mailto:contact@topoutils.ia">contact@topoutils.ia</Link>.
            </p>

            <h2 id="mentions">Mentions légales</h2>
            <p>
              <strong>Éditeur :</strong> TopOutils.IA<br />
              <strong>Directeur de publication :</strong> Équipe éditoriale<br />
              <strong>Hébergeur :</strong> Cloudflare Pages<br />
              <strong>Contact :</strong> contact@topoutils.ia
            </p>

            <h2 id="cookies">Cookies et données</h2>
            <p>
              Nous utilisons <strong>Plausible Analytics</strong>, un outil d'analyse open source 100% conforme RGPD :
              aucun cookie, aucune donnée personnelle collectée, aucune adresse IP stockée. Si vous refusez le tracking
              depuis notre bannière, Plausible n'est pas chargé du tout.
            </p>
            <p>
              Aucune donnée n'est revendue à des tiers. Aucun cookie publicitaire. Aucun pixel de tracking marketing.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
