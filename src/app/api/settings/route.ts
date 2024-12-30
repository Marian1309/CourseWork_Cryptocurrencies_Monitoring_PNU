import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { DefaultView, DisplayMode } from '@prisma/client';
import { nanoid } from 'nanoid';

import database from '@/db';

import prettyPrint from '@/lib/pretty-print';

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
          refreshInterval: 60_000,
          priceAlerts: true,
          portfolioSummary: false,
          displayMode: DisplayMode.COMFORTABLE,
          defaultView: DefaultView.LIST
        }
      });

      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    prettyPrint.error(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();

  prettyPrint.log(body);
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  return NextResponse.json(settings);
};
