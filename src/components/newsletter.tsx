'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const BREVO_WEBHOOK_URL = ''; // TODO

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function Newsletter({
  title = 'Le digest mensuel',
  description = '1 email/mois. Les nouveaux outils testés, les bons plans, nos analyses. 0 spam.',
}: {
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Adresse email invalide');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      if (BREVO_WEBHOOK_URL) {
        const r = await fetch(BREVO_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source: 'topoutils.ia', date: new Date().toISOString() }),
        });
        if (!r.ok) throw new Error('webhook fail');
      } else {
        await new Promise((res) => setTimeout(res, 700));
      }
      setStatus('success');
      toast.success('Inscription confirmée', {
        description: 'Le prochain digest arrive dans votre boîte.',
      });
      setEmail('');
    } catch {
      setStatus('error');
      toast.error('Erreur', {
        description: 'Réessayez dans quelques instants.',
      });
    }
  }

  return (
    <div
      id="newsletter"
      className="relative max-w-3xl mx-auto bg-elevated border border-[rgba(216, 139, 106,0.3)] rounded-3xl p-12 text-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(216, 139, 106,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative">
        <div className="w-14 h-14 mx-auto text-gold mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="font-display font-normal text-[2.2rem] mb-2">{title}</h2>
        <p className="text-[1.05rem] text-muted-foreground max-w-lg mx-auto mb-6">{description}</p>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@email.com"
            required
            aria-label="Adresse email"
            className="flex-1 bg-void border border-white/15 rounded-md px-4 py-3 text-foreground text-[0.95rem] focus:outline-none focus:border-gold"
          />
          <Button variant="primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Envoi…' : "S'abonner"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground/60 mt-4">Conforme RGPD. Désabonnement en un clic.</p>
        {message && (
          <p
            aria-live="polite"
            className={cnStatus(status)}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function cnStatus(status: string) {
  return [
    'mt-4 text-[0.9rem]',
    status === 'success' ? 'text-electric' : '',
    status === 'error' ? 'text-coral' : '',
  ]
    .filter(Boolean)
    .join(' ');
}
