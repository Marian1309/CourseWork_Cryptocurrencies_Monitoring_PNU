import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';

import database from '@/db';

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
          currency: 'USD',
          refreshInterval: 60_000,
          priceAlerts: true,
          portfolioSummary: false,
          displayMode: 'comfortable',
          defaultView: 'list'
        }
      });

      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await database.settings.upsert({
    where: { userId },
    update: {
      theme: body.theme,
      currency: body.currency,
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
      currency: body.currency ?? 'USD',
      refreshInterval: body.refreshInterval ?? 60_000,
      priceAlerts: body.priceAlerts ?? true,
      portfolioSummary: body.portfolioSummary ?? false,
      displayMode: body.displayMode ?? 'comfortable',
      defaultView: body.defaultView ?? 'list'
    }
  });

  return NextResponse.json(settings);
};
