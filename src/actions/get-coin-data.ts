'use server';

import { auth } from '@clerk/nextjs/server';

import coinMarketCapApi from '@/lib/api';
import prettyPrint from '@/lib/pretty-print';

const getCoinData = async (coinSymbol: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('User not found');

    // Fetch coin data from CoinMarketCap API
    const { data } = await coinMarketCapApi.get(
      `/v1/cryptocurrency/quotes/latest?symbol=${coinSymbol}`
    );

    return data?.data ?? undefined;
  } catch (error) {
    prettyPrint.error(error);
  }
};

export default getCoinData;
