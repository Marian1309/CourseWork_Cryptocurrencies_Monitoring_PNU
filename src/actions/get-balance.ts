'use server';

import { auth } from '@clerk/nextjs/server';

import database from '@/db';

const getUserBalance = async () => {
  const { userId } = await auth();

  if (!userId) return false;

  const user = await database.user.findUnique({ where: { id: userId } });

  return user?.balance ?? undefined;
};

export default getUserBalance;
