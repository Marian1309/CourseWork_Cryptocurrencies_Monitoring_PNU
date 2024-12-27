'use server';

import { auth } from '@clerk/nextjs/server';

import database from '@/db';

const getUserCoins = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }

  const coins = await database.coin.findMany({
    where: { userId }
  });

  return coins;
};

export default getUserCoins;
