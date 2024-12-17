import type { FC, PropsWithChildren } from 'react';

type Properties = PropsWithChildren;

const Providers: FC<Properties> = ({ children }) => {
  return <>{children}</>;
};

export default Providers;
