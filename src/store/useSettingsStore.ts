// src/store/useSettingsStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Settings, DEFAULT_SETTINGS } from '@/types';

interface SettingsState {
  settings: Settings;
  // Actions
  updateSettings: (partialSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (partialSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...partialSettings },
        })),

      resetSettings: () =>
        set(() => ({
          settings: DEFAULT_SETTINGS,
        })),
    }),
    {
      name: 'llm-settings-storage', // localStorage 中的 key 名称
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage
    }
  )
);

// const useSettingsStore = create<SettingsState>()(
//     persist(
//         (set) => ({}),
//         {

//         }
//     )
// )