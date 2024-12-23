import { NextResponse } from 'next/server';

import { Webhook } from 'svix';

import database from '@/db';

const secret = process.env.CLERK_WEBHOOK_SECRET!;

const handler = async (request: Request) => {
  const payload = await request.text();
  const headers = request.headers;

  console.log({ headers });
  console.log({ payload });

  try {
    const wh = new Webhook(secret);
    const event = wh.verify(payload, headers);

    if (event.type === 'user.created') {
      const { id, email_addresses } = event.data;

      // Extract the primary email address
      const email = email_addresses?.find((event) => event.id === id)?.email_address;

      // Create the user in Prisma
      if (email) {
        await database.user.create({
          data: {
            clerkId: id,
            email
          }
        });
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
};

export { handler as GET, handler as POST };
