import { useDirMode } from 'next-direction';
import React from 'react';

const DirModeChanger = () => {
  const [mounted, setMounted] = React.useState(false);
  const { dirmode, setDirMode } = useDirMode();

  // When mounted on client, now we can show the UI
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className="w-8 h-8"
      onClick={() => setDirMode(dirmode === 'rtl' ? 'ltr' : 'rtl')}
    >
      <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 10v5h2V4h2v11h2V4h2V2h-8C7.79 2 6 3.79 6 6s1.79 4 4 4zm-2 7v-3l-4 4 4 4v-3h12v-2H8z" />
      </svg>
    </button>
  );
};

export default DirModeChanger;
