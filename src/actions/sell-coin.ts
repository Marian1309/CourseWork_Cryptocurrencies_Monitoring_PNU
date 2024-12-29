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

  if (!userId) {
    throw new Error('User not found');
  }

  if (!coinId || !amount) {
    throw new Error('Required params');
  }

  return await database.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userCoins = await tx.coin.findMany({
      where: {
        userId
      }
    });

    const userCoin = userCoins.find((coin) => coin.coinId === coinId);

    if (!userCoin) {
      throw new Error('Coin not found');
    }

    if (userCoin.amount < amount) {
      throw new Error('Not enough coins');
    }

    const userBalance = user.balance;

    const totalSoldPrice = amount * soldPrice;

    const newBalance = userBalance + totalSoldPrice;

    await tx.user.update({
      where: {
        id: user.id
      },
      data: {
        balance: newBalance
      }
    });

    const updatedUserCoin = await tx.coin.update({
      where: {
        id: userCoin.id
      },
      data: {
        amount: {
          decrement: amount
        }
      }
    });

    if (updatedUserCoin.amount === 0) {
      await tx.coin.delete({
        where: {
          id: userCoin.id
        }
      });
    }
  });
};

export default sellCoin;
