import { useQuery } from '@tanstack/react-query';

import searchCrypto from '@/actions/search';

interface CryptoQueryParameters {
  params: {
    page: string;
    limit: number;
    searchTerm?: string;
  };
}

const useCrypto = (
  searchTerm: string,
  refetchInterval: number,
  { params: { page, limit } }: CryptoQueryParameters
) => {
  return useQuery({
    queryKey: ['crypto', page, searchTerm],
    queryFn: () =>
      searchCrypto({
        page: Number.parseInt(page),
        limit,
        searchTerm: searchTerm || undefined
      }),
    refetchInterval
  });
};

export default useCrypto;
