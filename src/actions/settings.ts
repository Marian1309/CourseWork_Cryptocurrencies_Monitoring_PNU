'use server';

import { auth } from '@clerk/nextjs/server';
import type { Settings } from '@prisma/client';
import { DefaultView, DisplayMode } from '@prisma/client';
import { nanoid } from 'nanoid';

import database from '@/db';

import prettyPrint from '@/lib/pretty-print';

export const getUserSettings = async (): Promise<Settings | { error: string }> => {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {
    const settings = await database.settings.findUnique({
      where: { userId }
    });

    if (!settings) {
      const defaultSettings = await database.settings.create({
        data: {
          id: nanoid(),
          userId,
          theme: 'system',
          refreshInterval: 60_000,
          priceAlerts: true,
          portfolioSummary: false,
          displayMode: DisplayMode.COMFORTABLE,
          defaultView: DefaultView.LIST
        }
      });

      return defaultSettings;
    }

    return settings;
  } catch (error) {
    prettyPrint.error(error);
    return { error: 'Failed to fetch settings' };
  }
};

export const updateUserSettings = async (
  body: Settings
): Promise<Settings | { error: string }> => {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const settings = await database.settings.upsert({
    where: { userId },
    update: {
      theme: body.theme,
      refreshInterval: body.refreshInterval,
      priceAlerts: body.priceAlerts,
      portfolioSummary: body.portfolioSummary,
      displayMode: body.displayMode,
      defaultView: body.defaultView
    },
    create: {
      id: nanoid(),
      userId,
      theme: body.theme ?? 'system',
      refreshInterval: body.refreshInterval ?? 60_000,
      priceAlerts: body.priceAlerts ?? true,
      portfolioSummary: body.portfolioSummary ?? false,
      displayMode: body.displayMode ?? DisplayMode.COMFORTABLE,
      defaultView: body.defaultView ?? DefaultView.LIST
    }
  });

  return settings;
};
