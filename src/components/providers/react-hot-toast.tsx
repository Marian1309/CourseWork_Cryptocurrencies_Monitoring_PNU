import type { PropsWithChildren } from 'react';

import { Toaster } from 'react-hot-toast';

type Properties = PropsWithChildren;

const ReactHotToastProvider = ({ children }: Properties) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ReactHotToastProvider;
