import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'TopOutils.IA — Comparatif des outils IA en français';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(216,139,106,0.20) 0%, rgba(216,139,106,0.04) 40%, transparent 70%), #15090E',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#D88B6A',
              boxShadow: '0 0 24px #D88B6A',
            }}
          />
          <div
            style={{
              color: '#D88B6A',
              fontSize: 32,
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            TopOutils.IA
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.05,
              color: '#F2EAD9',
              letterSpacing: -2,
              fontStyle: 'italic',
              maxWidth: 1000,
              display: 'flex',
            }}
          >
            Trouvez l&apos;outil IA parfait. En français.
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#B8A89B',
              fontFamily: 'sans-serif',
              maxWidth: 900,
              display: 'flex',
            }}
          >
            62 IA testées, notées, comparées · Indépendant · Mis à jour mai 2026
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#B8A89B',
            fontSize: 22,
            fontFamily: 'sans-serif',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>8 catégories · 62 outils</span>
          <span>topoutils.ia</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
