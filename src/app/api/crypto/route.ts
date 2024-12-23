import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import coinMarketCapApi from '@/lib/api';

export const runtime = 'experimental-edge';

export const GET = async (request: NextRequest) => {
  const searchParameters = request.nextUrl.searchParams;

  const start = searchParameters.get('start') || '1';
  const limit = searchParameters.get('limit') || '100';
  const sort = searchParameters.get('sort') || 'market_cap';
  const sortDirection = searchParameters.get('sort_dir') || 'desc';
  const currency = searchParameters.get('currency') || 'USD';

  try {
    const response = await coinMarketCapApi.get(
      `/v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}&sort=${sort}&sort_dir=${sortDirection}&convert=${currency}`
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
  }
};
