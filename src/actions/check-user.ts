'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import database from '@/db';

import prettyPrint from '@/lib/pretty-print';

const checkUser = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const fullName = user?.fullName ?? '';
    const email = user?.emailAddresses[0]?.emailAddress ?? '';

    await database.user.upsert({
      where: { id: userId },
      update: { fullName, email },
      create: { id: userId, fullName, email }
    });

    return true;
  } catch (error) {
    prettyPrint.error(error);
    return false;
  }
};

export default checkUser;
