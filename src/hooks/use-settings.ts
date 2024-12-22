import { useEffect, useState } from 'react';

type Settings = {
  theme: 'light' | 'dark' | 'system';
  currency: 'USD' | 'EUR' | 'GBP';
  notifications: {
    priceAlerts: boolean;
    newsUpdates: boolean;
    portfolioSummary: boolean;
  };
  displayMode: 'compact' | 'comfortable';
  defaultView: 'list' | 'grid';
  refreshInterval: number;
};

const defaultSettings: Settings = {
  theme: 'system',
  currency: 'USD',
  notifications: {
    priceAlerts: true,
    newsUpdates: true,
    portfolioSummary: false
  },
  displayMode: 'comfortable',
  defaultView: 'list',
  refreshInterval: 60_000
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const storedSettings = localStorage.getItem('cryptoMonitorSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('cryptoMonitorSettings', JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
}
