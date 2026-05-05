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
          background: '#0D111B',
          color: '#F0F4FF',
          border: '1px solid rgba(232, 200, 120, 0.25)',
          fontFamily: 'var(--font-body)',
        },
      }}
    />
  );
}
