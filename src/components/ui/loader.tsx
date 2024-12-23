'use client';

import type { FC } from 'react';

import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type Properties = {
  className?: string;
  size?: number;
};

const Loader: FC<Properties> = ({ className, size = 32 }) => {
  return (
    <div className={cn('flex h-full items-center justify-center', className)}>
      <Loader2 className="animate-spin text-blue-500" size={size} />
    </div>
  );
};

export default Loader;
