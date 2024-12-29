'use server';

import { auth } from '@clerk/nextjs/server';

import database from '@/db';

import prettyPrint from '@/lib/pretty-print';

const getUserCoins = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('User not found');

    // Fetch user's coins from the database
    const coins = await database.coin.findMany({
      where: { userId },
      select: { coinId: true, amount: true, symbol: true, name: true, boughtPrice: true } // Select only necessary fields
    });

    return coins;
  } catch (error) {
    prettyPrint.error(error);
  }
};

export default getUserCoins;
