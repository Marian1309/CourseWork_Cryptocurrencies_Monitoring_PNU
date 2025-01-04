'use client';

import type { ReactNode } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import SettingsProvider from '@/context/settings';

import { TanstackQueryProvider, ThemeProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

type Properties = {
  children: ReactNode;
  className?: string;
};

const Providers = ({ children, className }: Properties) => {
  return (
    <main className={className}>
      <NuqsAdapter>
        <SettingsProvider>
          <ThemeProvider>
            <TanstackQueryProvider>{children}</TanstackQueryProvider>
            <Toaster />
          </ThemeProvider>
        </SettingsProvider>
      </NuqsAdapter>
    </main>
  );
};

export default Providers;
