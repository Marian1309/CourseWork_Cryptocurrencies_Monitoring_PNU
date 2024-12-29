'use server';

import { auth } from '@clerk/nextjs/server';

import database from '@/db';

type Parameters = {
  coinId: number;
  amount: number;
  soldPrice: number;
};

const sellCoin = async ({ coinId, amount, soldPrice }: Parameters) => {
  const { userId } = await auth();

  if (!userId) throw new Error('User not found');
  if (!coinId || !amount) throw new Error('Required params');

  return database.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        coins: {
          where: { coinId }
        }
      }
    });

    if (!user) throw new Error('User not found');

    const userCoin = user.coins[0]; // Since `where: { coinId }` ensures only relevant coin

    if (!userCoin) throw new Error('Coin not found');
    if (userCoin.amount < amount) throw new Error('Not enough coins');

    const totalSoldPrice = amount * soldPrice;
    const newBalance = user.balance + totalSoldPrice;

    // Update balance and coin atomically
    await Promise.all([
      tx.user.update({
        where: { id: user.id },
        data: { balance: newBalance }
      }),
      tx.coin.update({
        where: { id: userCoin.id },
        data: {
          amount: userCoin.amount > amount ? { decrement: amount } : undefined // Avoid decrementing to zero
        }
      })
    ]);

    // Delete coin if the amount reaches zero
    if (userCoin.amount === amount) {
      await tx.coin.delete({ where: { id: userCoin.id } });
    }
  });
};

export default sellCoin;
