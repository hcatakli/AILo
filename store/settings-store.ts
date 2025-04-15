import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, CommunitySettings } from '@/types/settings';

interface SettingsState extends Settings {
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setAppLanguage: (language: string) => void;
  updateCommunitySetting: <K extends keyof CommunitySettings>(key: K, value: CommunitySettings[K]) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      notificationsEnabled: true,
      appLanguage: 'en',
      communitySettings: {
        showOnlineStatus: true,
        allowDirectMessages: true,
        showLearningProgress: true,
        blockedUsers: [],
      },
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      
      setAppLanguage: (language: string) => set({ appLanguage: language }),
      
      updateCommunitySetting: (key, value) => set((state) => ({
        communitySettings: {
          ...state.communitySettings,
          [key]: value,
        },
      })),
      
      blockUser: (userId: string) => set((state) => ({
        communitySettings: {
          ...state.communitySettings,
          blockedUsers: [...state.communitySettings.blockedUsers, userId],
        },
      })),
      
      unblockUser: (userId: string) => set((state) => ({
        communitySettings: {
          ...state.communitySettings,
          blockedUsers: state.communitySettings.blockedUsers.filter((id) => id !== userId),
        },
      })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);