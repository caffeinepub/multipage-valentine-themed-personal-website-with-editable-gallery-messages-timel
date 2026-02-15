import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContentVersionState {
  activeVersion: string;
  setActiveVersion: (version: string) => void;
  initializeFromUrl: (urlVersion: string | null) => void;
}

export const useContentVersionStore = create<ContentVersionState>()(
  persist(
    (set) => ({
      activeVersion: '7',
      setActiveVersion: (version: string) => set({ activeVersion: version }),
      initializeFromUrl: (urlVersion: string | null) => {
        if (urlVersion && urlVersion.trim()) {
          set({ activeVersion: urlVersion.trim() });
        }
      },
    }),
    {
      name: 'content-version-storage',
    }
  )
);

export function useContentVersion() {
  const { activeVersion, setActiveVersion, initializeFromUrl } = useContentVersionStore();
  return { activeVersion, setActiveVersion, initializeFromUrl };
}
