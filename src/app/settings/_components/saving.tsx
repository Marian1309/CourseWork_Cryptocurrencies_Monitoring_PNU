import type { FC } from 'react';

import type { Settings } from '@prisma/client';

import { Button } from '@/components/ui/button';

type Properties = {
  setTemporarySettings: (settings: Settings) => void;
  settings: Settings;
  handleSave: () => void;
};

const Saving: FC<Properties> = ({ setTemporarySettings, settings, handleSave }) => {
  return (
    <div className="mt-6 flex justify-end space-x-4">
      <Button onClick={() => setTemporarySettings(settings)} variant="outline">
        Cancel
      </Button>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
};

export default Saving;
