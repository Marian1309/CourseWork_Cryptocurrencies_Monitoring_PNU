import type { FC, ReactNode } from 'react';

import { TanstackQueryProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

type Properties = {
  children: ReactNode;
  className?: string;
};

const Providers: FC<Properties> = ({ children, className }) => {
  return (
    <main className={className}>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
      <Toaster />
    </main>
  );
};

export default Providers;
