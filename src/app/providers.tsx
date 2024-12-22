import type { FC, ReactNode } from 'react';

import { TanstackQueryProvider } from '@/components/providers';

type Properties = {
  children: ReactNode;
  className?: string;
};

const Providers: FC<Properties> = ({ children, className }) => {
  return (
    <main className={className}>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </main>
  );
};

export default Providers;
