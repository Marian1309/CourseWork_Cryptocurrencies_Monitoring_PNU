import { redirect } from 'next/navigation';

export const runtime = 'experimental-edge';

const NotFound = () => redirect('/');

export default NotFound;
