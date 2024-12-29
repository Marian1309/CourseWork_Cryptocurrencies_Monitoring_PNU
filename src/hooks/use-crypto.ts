import { useQuery } from '@tanstack/react-query';

import searchCrypto from '@/actions/search';

type CryptoQueryParameters = {
  params: {
    page: string;
    limit: number;
    searchTerm?: string;
  };
};

const useCrypto = (
  { params: { page, limit, searchTerm } }: CryptoQueryParameters,
  refetchInterval: number
) => {
  return useQuery({
    queryKey: ['crypto', page, searchTerm],
    queryFn: () =>
      searchCrypto({
        page: +page,
        limit,
        searchTerm: searchTerm || undefined
      }),
    refetchInterval
  });
};

export default useCrypto;
