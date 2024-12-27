'use server';

import { auth } from '@clerk/nextjs/server';

import database from '@/db';

type Coin = {
  name: string;
  amount: number;
  symbol: string;
  price: number;
  id: string;
};

const buyCoin = async (coin: Coin) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('User not found');
  }

  await database.$transaction(async (tx) => {
    await tx.coin.create({
      data: {
        name: coin.name,
        amount: coin.amount,
        symbol: coin.symbol,
        boughtPrice: coin.price,
        boughtAt: new Date(),
        coinId: +coin.id,
        userId
      }
    });

    await tx.user.update({
      where: { id: userId },
      data: { balance: { decrement: Number(coin.price.toFixed(2)) * coin.amount } }
    });
  });
};

export default buyCoin;
