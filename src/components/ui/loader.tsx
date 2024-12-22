'use client';

import type { FC } from 'react';

import { Loader2 } from 'lucide-react';

type Properties = {
  loading?: boolean;
};

const Loader: FC<Properties> = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
};

export default Loader;
