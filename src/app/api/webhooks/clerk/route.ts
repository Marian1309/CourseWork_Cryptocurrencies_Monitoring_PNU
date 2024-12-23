import { Webhook } from 'svix';

import database from '@/db';

const secret = process.env.CLERK_WEBHOOK_SECRET;

export default async function handler(request, response) {
  const payload = request.body;
  const headers = request.headers;

  try {
    const wh = new Webhook(secret);
    const event = wh.verify(payload, headers);

    if (event.type === 'user.created') {
      const { id, email_addresses } = event.data;

      // Extract the primary email address
      const email = email_addresses.find((event) => event.id === id)?.email_address;

      // Create the user in Prisma
      await database.user.create({
        data: {
          clerkId: id,
          email
        }
      });
    }

    response.status(200).send('Webhook processed successfully');
  } catch {
    response.status(400).send('Webhook Error');
  }
}
