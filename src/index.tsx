import NextHead from 'next/head';
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UseDirModeProps {
  setDirMode: (dirmode: string) => void;
  dirmode?: 'ltr' | 'rtl';
  forcedDirMode?: string;
}

const DirModeContext = createContext<UseDirModeProps>({
  setDirMode: _ => {},
  dirmode: undefined,
});
export const useDirMode = () => useContext(DirModeContext);

export interface DirModeProviderProps {
  forcedDirMode?: string;
  storageKey?: string;
  defaultDirMode?: string;
}

export const DirModeProvider: React.FC<DirModeProviderProps> = ({
  forcedDirMode,
  storageKey = 'dirmode',
  defaultDirMode = 'ltr',
  children,
}) => {
  const [dirmode, setDirModeState] = useState<UseDirModeProps['dirmode']>(() =>
    getDirMode(storageKey)
  );

  const changeDirMode = useCallback((dirmode, updateStorage = true) => {
    const name = dirmode;

    if (updateStorage) {
      try {
        localStorage.setItem(storageKey, dirmode);
      } catch (e) {
        // Unsupported
      }
    }

    const d = document.documentElement;

    d.setAttribute('dir', name);

    // All of these deps are stable and should never change
  }, []); // eslint-disable-line

  const setDirMode = useCallback(
    newDirMode => {
      if (forcedDirMode) {
        return;
      }

      changeDirMode(newDirMode);
      setDirModeState(newDirMode);
    },
    // All of these deps are stable and should never change
    [] // eslint-disable-line
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      const dirmode = e.newValue;
      setDirMode(dirmode);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // All of these deps are stable and should never change
  }, []); // eslint-disable-line

  return (
    <DirModeContext.Provider
      value={{
        forcedDirMode,
        dirmode,
        setDirMode,
      }}
    >
      <DirModeScript
        {...{
          forcedDirMode,
          storageKey,
          defaultDirMode,
        }}
      />
      {children}
    </DirModeContext.Provider>
  );
};

const DirModeScript = memo(
  ({
    forcedDirMode,
    storageKey,
    defaultDirMode,
  }: {
    forcedDirMode?: string;
    storageKey: string;
    defaultDirMode: string;
  }) => {
    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      return `var d=document.documentElement;`;
    })();

    const updateDOM = (name: string, literal?: boolean) => {
      const val = literal ? name : `'${name}'`;

      return `d.setAttribute('dir', ${val})`;
    };

    return (
      <NextHead>
        {forcedDirMode ? (
          <script
            key="next-dirmodes-script"
            dangerouslySetInnerHTML={{
              // These are minified via Terser and then updated by hand, don't recommend
              // prettier-ignore
              __html: `!function(){${optimization}${updateDOM(forcedDirMode)}}()`
            }}
          />
        ) : (
          <script
            key="next-dirmodes-script"
            dangerouslySetInnerHTML={{
              // prettier-ignore
              __html: `!function(){try{${optimization}var t=localStorage.getItem("${storageKey}");if(!t)return localStorage.setItem("${storageKey}","${defaultDirMode}"),${updateDOM(defaultDirMode)};${updateDOM('t', true)}}catch(t){}}();`
            }}
          />
        )}
      </NextHead>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render when forcedDirMode changes
    // the rest of the props should be completely stable
    if (prevProps.forcedDirMode !== nextProps.forcedDirMode) return false;
    return true;
  }
);

// Helpers
const getDirMode = (key: string) => {
  if (typeof window === 'undefined') return undefined;
  let dirmode;
  try {
    dirmode = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return dirmode;
};
