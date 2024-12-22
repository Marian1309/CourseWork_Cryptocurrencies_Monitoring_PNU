import { useQuery } from '@tanstack/react-query';

import type { SortConfig } from '@/types/globals';

const fetchCryptoData = async ({ key, direction }: SortConfig) => {
  const response = await fetch(`/api/crypto?sort=${key}&sort_dir=${direction}`);

  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }

  return response.json();
};

const useCrypto = (sortConfig: SortConfig) => {
  return useQuery({
    queryKey: ['crypto'],
    queryFn: () => fetchCryptoData(sortConfig),
    select: ({ data }) => data
  });
};

export default useCrypto;
