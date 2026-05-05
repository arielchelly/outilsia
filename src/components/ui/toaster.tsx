'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      richColors={false}
      closeButton
      toastOptions={{
        style: {
          background: '#16161A',
          color: '#F5F5F7',
          border: '1px solid rgba(212, 184, 150, 0.25)',
          fontFamily: 'var(--font-body)',
        },
      }}
    />
  );
}
