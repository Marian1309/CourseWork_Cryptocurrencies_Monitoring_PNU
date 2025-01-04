'use server';

import { auth } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';

import database from '@/db';

import { COMMISSION_PERCENT, COMMISSION_PER_COIN } from '@/constants';

type Parameters = {
  coinId: number;
  amount: number;
  soldPrice: number;
};

const sellCoin = async ({ coinId, amount, soldPrice }: Parameters) => {
  const { userId } = await auth();

  if (!userId) throw new Error('User not found');
  if (!coinId || !amount) throw new Error('Required params');

  const commision =
    COMMISSION_PERCENT + amount * COMMISSION_PER_COIN + amount * soldPrice * 0.05;

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

    const userCoin = user.coins[0];

    if (!userCoin) throw new Error('Coin not found');
    if (userCoin.amount < amount) throw new Error('Not enough coins');

    const totalSoldPrice = amount * soldPrice;
    const newBalance = user.balance + totalSoldPrice;

    await Promise.all([
      tx.user.update({
        where: { id: user.id },
        data: { balance: newBalance }
      }),
      tx.coin.update({
        where: { id: userCoin.id },
        data: {
          amount: userCoin.amount > amount ? { decrement: amount + commision } : undefined
        }
      })
    ]);

    if (userCoin.amount === amount) {
      await tx.coin.delete({ where: { id: userCoin.id } });
    }

    const admin = await tx.user.findFirst({
      where: { role: Role.ADMIN }
    });

    if (admin) {
      await tx.user.update({
        where: { id: admin.id },
        data: { balance: { increment: commision } }
      });
    }
  });
};

export default sellCoin;
