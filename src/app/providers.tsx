import type { FC, PropsWithChildren } from 'react';

import { TanstackQueryProvider } from '@/components/providers';

type Properties = PropsWithChildren;

const Providers: FC<Properties> = ({ children }) => {
  return (
    <main>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </main>
  );
};

export default Providers;
