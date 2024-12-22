'use client';

import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

import type { QueryClientConfig } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 хвилина
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
};

type Properties = { children: ReactNode };

const TanstackQueryProvider: FC<Properties> = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient(defaultQueryClientConfig), []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanstackQueryProvider;
