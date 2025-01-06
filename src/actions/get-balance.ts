'use server';

import { auth } from '@clerk/nextjs/server';

import database from '@/db';

import prettyPrint from '@/lib/pretty-print';

const getUserBalance = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const user = await database.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    return user?.balance ?? undefined;
  } catch (error) {
    prettyPrint.error(error);
  }
};

export default getUserBalance;
