import type { FC, PropsWithChildren } from 'react';

import { Toaster } from 'react-hot-toast';

type Properties = PropsWithChildren;

const ReactHotToastProvider: FC<Properties> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ReactHotToastProvider;
