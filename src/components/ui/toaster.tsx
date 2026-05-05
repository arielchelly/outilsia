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
          background: '#211119',
          color: '#F2EAD9',
          border: '1px solid rgba(216, 139, 106, 0.25)',
          fontFamily: 'var(--font-body)',
        },
      }}
    />
  );
}
