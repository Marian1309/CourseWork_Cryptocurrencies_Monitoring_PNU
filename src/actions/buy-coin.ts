'use server';

import { auth } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';

import database from '@/db';

import { COMMISSION_PERCENT, COMMISSION_PER_COIN } from '@/constants';

export type Coin = {
  name: string;
  amount: number;
  symbol: string;
  price: number;
  id: string;
};

const buyCoin = async (coin: Coin): Promise<{ message?: string } | undefined> => {
  const { userId } = await auth();

  if (!userId) throw new Error('User not found');

  const commision =
    COMMISSION_PERCENT +
    coin.amount * COMMISSION_PER_COIN +
    coin.amount * coin.price * 0.05;

  const totalCost = coin.price * coin.amount + commision;

  return await database.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('User not found');

    if (user.balance < totalCost) {
      return {
        message: 'Insufficient balance'
      };
    }

    await tx.coin.create({
      data: {
        name: coin.name,
        amount: coin.amount,
        symbol: coin.symbol,
        boughtPrice: +coin.price,
        boughtAt: new Date(),
        coinId: +coin.id,
        userId
      }
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: Number(totalCost.toFixed(4))
        }
      }
    });

    const admin = await tx.user.findFirst({
      where: {
        role: Role.ADMIN
      }
    });

    if (admin) {
      await tx.user.update({
        where: { id: admin.id },
        data: { balance: { increment: Number(commision.toFixed(4)) } }
      });
    }
  });
};

export default buyCoin;
