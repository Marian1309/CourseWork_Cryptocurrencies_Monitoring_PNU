'use server';

import axios from 'axios';

import prettyPrint from '@/lib/pretty-print';

const searchCrypto = async ({
  page,
  limit,
  searchTerm
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  try {
    const { data } = await axios.get('https://coins-marian1309.vercel.app', {
      params: {
        searchTerm: searchTerm || undefined,
        page,
        limit
      }
    });

    return data;
  } catch (error: unknown) {
    prettyPrint(error);
  }
};

export default searchCrypto;
