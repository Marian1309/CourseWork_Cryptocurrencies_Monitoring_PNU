'use client';

import type { FC } from 'react';

import { BounceLoader } from 'react-spinners';

type Properties = {
  loading?: boolean;
};

const Loading: FC<Properties> = ({ loading = true }) => {
  return (
    <div className="min-h-screen flex-center">
      <BounceLoader color="hsl(var(--text-accent))" loading={loading} size={40} />
    </div>
  );
};

export default Loading;
