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

  if (!userId) throw new Error('User not found');

  const totalCost = +(+coin.price.toString().slice(1) * coin.amount).toFixed(2);

  await database.$transaction(async (tx) => {
    // Add the coin to the user's account
    await tx.coin.create({
      data: {
        name: coin.name,
        amount: coin.amount,
        symbol: coin.symbol,
        boughtPrice: +coin.price.toString().slice(1),
        boughtAt: new Date(),
        coinId: +coin.id,
        userId
      }
    });

    // Deduct the total cost from the user's balance
    await tx.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: totalCost
        }
      }
    });
  });
};

export default buyCoin;
