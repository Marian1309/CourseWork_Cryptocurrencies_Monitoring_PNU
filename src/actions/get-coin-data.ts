'use server';

import { auth } from '@clerk/nextjs/server';

import coinMarketCapApi from '@/lib/api';

const getCoinData = async (coinSymbol: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }

  const { data } = await coinMarketCapApi.get(
    `/v1/cryptocurrency/quotes/latest?symbol=${coinSymbol}`
  );

  const coinData = await data.data;

  return coinData;
};

export default getCoinData;
