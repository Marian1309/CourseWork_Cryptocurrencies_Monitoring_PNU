import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import coinMarketCapApi from '@/lib/api';

const CMC_API_KEY = process.env['X_CMC_PRO_API_KEY'];

export const GET = async (request: NextRequest) => {
  const searchParameters = request.nextUrl.searchParams;

  console.log({ searchParameters });

  const start = searchParameters.get('start') || '1';
  const limit = searchParameters.get('limit') || '100';
  const sort = searchParameters.get('sort') || 'market_cap';
  const sortDirection = searchParameters.get('sort_dir') || 'desc';

  try {
    const response = await coinMarketCapApi.get(
      `/listings/latest?start=${start}&limit=${limit}&sort=${sort}&sort_dir=${sortDirection}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY || ''
        }
      }
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
