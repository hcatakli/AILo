export interface CommunitySettings {
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showLearningProgress: boolean;
  blockedUsers: string[];
}

export interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  appLanguage: string;
  communitySettings: CommunitySettings;
}