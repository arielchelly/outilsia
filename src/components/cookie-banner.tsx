'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('consent');
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function decide(accepted: boolean) {
    localStorage.setItem('consent', accepted ? 'accepted' : 'rejected');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 max-w-[720px] mx-auto bg-elevated border border-[rgba(216, 139, 106,0.3)] rounded-2xl p-5 z-[10000] shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4 animate-fade-in"
      role="dialog"
      aria-label="Consentement cookies"
    >
      <p className="text-[0.9rem] text-muted-foreground flex-1 min-w-[260px]">
        Nous utilisons <strong className="text-foreground">Plausible Analytics</strong> (anonymisé, conforme RGPD) pour
        comprendre l'usage du site. Aucune donnée personnelle n'est collectée.
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => decide(false)}>
          Refuser
        </Button>
        <Button variant="primary" size="sm" onClick={() => decide(true)}>
          Accepter
        </Button>
      </div>
    </div>
  );
}
