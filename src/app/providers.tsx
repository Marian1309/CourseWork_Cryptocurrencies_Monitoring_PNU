import type { FC, ReactNode } from 'react';

import { SettingsProvider } from '@/context/settings';

import { TanstackQueryProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

type Properties = {
  children: ReactNode;
  className?: string;
};

const Providers: FC<Properties> = ({ children, className }) => {
  return (
    <main className={className}>
      <SettingsProvider>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Toaster />
      </SettingsProvider>
    </main>
  );
};

export default Providers;
