import { useQuery } from '@tanstack/react-query';

import type { SortConfig } from '@/types/globals';

import { CRYPTO_LIMIT } from '@/constants';

const fetchCryptoData = async (searchPage: number, { key, direction }: SortConfig) => {
  const start = searchPage === 1 ? 1 : CRYPTO_LIMIT * (searchPage - 1);

  const response = await fetch(
    `/api/crypto?sort=${key}&sort_dir=${direction}&start=${start}&limit=${CRYPTO_LIMIT}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }

  return response.json();
};

const useCrypto = (searchPage: number, sortConfig: SortConfig) => {
  return useQuery({
    queryKey: ['crypto'],
    queryFn: () => fetchCryptoData(searchPage, sortConfig),
    select: ({ data }) => data
  });
};

export default useCrypto;
