'use client';

import { useEffect, useState } from 'react';

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps
} from 'next-themes';

import { useSettings } from '@/context/settings';

function ThemeProvider({ children, ...properties }: ThemeProviderProps) {
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return;
  }

  return (
    <NextThemesProvider
      {...properties}
      attribute="class"
      enableSystem
      forcedTheme={settings?.theme === 'system' ? undefined : settings?.theme}
      themes={['light', 'dark']}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
