import type { NextPage } from 'next';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

const NotFound: NextPage = () => redirect('/');

export default NotFound;
