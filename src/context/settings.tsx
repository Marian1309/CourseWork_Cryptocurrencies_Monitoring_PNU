'use client';

import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { DefaultView, DisplayMode, type Settings } from '@prisma/client';
import { useTheme } from 'next-themes';

import prettyPrint from '@/lib/pretty-print';

type SettingsContextType = {
  settings: Settings | null;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  isLoading: boolean;
  changeTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  id: '',
  userId: '',
  theme: 'light',
  currency: 'USD',
  refreshInterval: 60_000,
  priceAlerts: true,
  portfolioSummary: false,
  displayMode: DisplayMode.COMFORTABLE,
  defaultView: DefaultView.LIST,
  fullName: '',
  email: ''
};

type Properties = {
  children: ReactNode;
};

const SettingsProvider: FC<Properties> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | undefined>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const { setTheme } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');

        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme);
          setSettings(data);
        } else {
          prettyPrint.error('Failed to fetch settings');
          setTheme(defaultSettings.theme);
          setSettings(defaultSettings);
        }
      } catch (error) {
        prettyPrint.error(`Error fetching settings: ${error}`);
        setTheme(defaultSettings.theme);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [setTheme]);

  const updateSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      try {
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });
        if (response.ok) {
          const updatedSettings = await response.json();
          setSettings(updatedSettings);
          if (newSettings.theme) {
            setTheme(newSettings.theme);
          }
        } else {
          prettyPrint.error('Failed to update settings');
        }
      } catch (error) {
        prettyPrint.error(`Error updating settings: ${error}`);
      }
    },
    [setTheme]
  );

  const changeTheme = async (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
    await updateSettings({ theme });
  };

  const value = {
    settings: settings || defaultSettings,
    updateSettings,
    isLoading,
    changeTheme
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

export default SettingsProvider;
