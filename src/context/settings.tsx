'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { DefaultView, DisplayMode, type Settings } from '@prisma/client';
import { useTheme } from 'next-themes';

import prettyPrint from '@/lib/pretty-print';

import { getUserSettings, updateUserSettings } from '@/actions/settings';

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

const SettingsProvider = ({ children }: Properties) => {
  const [settings, setSettings] = useState<Settings | undefined>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const { setTheme } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getUserSettings();

        if ('error' in settings) {
          setTheme(defaultSettings.theme);
          setSettings(defaultSettings);
        } else {
          setTheme(settings.theme);
          setSettings(settings);
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
        const updatedSettings = await updateUserSettings({
          ...settings,
          ...newSettings
        } as Settings);

        if ('error' in updatedSettings) {
          prettyPrint.error('Failed to update settings');
        } else {
          setSettings(updatedSettings);
          if (newSettings.theme) {
            setTheme(newSettings.theme);
          }
        }
      } catch (error) {
        prettyPrint.error(`Error updating settings: ${error}`);
      }
    },
    [setTheme, settings]
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
