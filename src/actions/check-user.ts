'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import database from '@/db';

const checkUser = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    await database.user.upsert({
      where: { id: userId },
      update: {
        fullName: user?.fullName ?? '',
        email: user?.emailAddresses[0].emailAddress ?? ''
      },
      create: {
        id: userId,
        fullName: user?.fullName ?? '',
        email: user?.emailAddresses[0].emailAddress ?? ''
      }
    });

    return true;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return false;
  }
};

export default checkUser;
