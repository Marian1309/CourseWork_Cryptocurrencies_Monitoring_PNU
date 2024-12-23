'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import type { Settings } from '@prisma/client';

import prettyPrint from '@/lib/pretty-print';

type SettingsContextType = {
  settings: Settings | null;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  id: '',
  userId: '',
  theme: 'system',
  currency: 'USD',
  refreshInterval: 60_000,
  priceAlerts: true,
  newsUpdates: true,
  portfolioSummary: false,
  displayMode: 'comfortable',
  defaultView: 'list'
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          prettyPrint(data);
          setSettings(data);
        } else {
          console.error('Failed to fetch settings');
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
      } else {
        console.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };
  return (
    <SettingsContext.Provider
      value={{ settings: settings || defaultSettings, updateSettings, isLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
