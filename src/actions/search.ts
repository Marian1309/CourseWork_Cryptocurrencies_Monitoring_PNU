'use server';

import axios from 'axios';

import prettyPrint from '@/lib/pretty-print';

type Parameters = {
  page: number;
  limit: number;
  searchTerm?: string;
};

const searchCrypto = async ({ page, limit, searchTerm }: Parameters) => {
  const parameters = {
    page,
    limit,
    searchTerm: searchTerm || ''
  };

  try {
    const { data } = await axios.get('https://coins-marian1309.vercel.app', {
      params: parameters
    });

    return data;
  } catch (error) {
    prettyPrint.error(`Error fetching crypto data: ${error}`);
  }
};

export default searchCrypto;
