'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...properties }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  }

  return <NextThemesProvider {...properties}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
