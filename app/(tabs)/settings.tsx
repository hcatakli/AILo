import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  Globe, 
  Moon, 
  Shield, 
  Users, 
  MessageCircle, 
  Award, 
  Download, 
  Trash2, 
  LogOut, 
  ChevronRight 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { 
    darkMode, 
    toggleDarkMode,
    notificationsEnabled,
    toggleNotifications,
    communitySettings,
    updateCommunitySetting
  } = useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#6200EA' }]}>
                <Moon size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={darkMode ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/settings/language')}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#2196F3' }]}>
                <Globe size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>App Language</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>English</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF9800' }]}>
                <Bell size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/settings/notification-preferences')}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF9800' }]}>
                <Bell size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>Notification Preferences</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#4CAF50' }]}>
                <Users size={20} color={colors.white} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Show Online Status</Text>
                <Text style={styles.settingDescription}>Let others see when you're active</Text>
              </View>
            </View>
            <Switch
              value={communitySettings.showOnlineStatus}
              onValueChange={(value) => updateCommunitySetting('showOnlineStatus', value)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={communitySettings.showOnlineStatus ? colors.primary : colors.card}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#4CAF50' }]}>
                <MessageCircle size={20} color={colors.white} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Allow Direct Messages</Text>
                <Text style={styles.settingDescription}>Receive messages from other users</Text>
              </View>
            </View>
            <Switch
              value={communitySettings.allowDirectMessages}
              onValueChange={(value) => updateCommunitySetting('allowDirectMessages', value)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={communitySettings.allowDirectMessages ? colors.primary : colors.card}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#4CAF50' }]}>
                <Award size={20} color={colors.white} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Show Learning Progress</Text>
                <Text style={styles.settingDescription}>Share your achievements with the community</Text>
              </View>
            </View>
            <Switch
              value={communitySettings.showLearningProgress}
              onValueChange={(value) => updateCommunitySetting('showLearningProgress', value)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={communitySettings.showLearningProgress ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/settings/blocked-users')}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#F44336' }]}>
                <Shield size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>Blocked Users</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/settings/download-data')}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#00BCD4' }]}>
                <Download size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>Download My Data</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/settings/clear-cache')}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: '#607D8B' }]}>
                <Trash2 size={20} color={colors.white} />
              </View>
              <Text style={styles.settingText}>Clear Cache</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutButton]}
            onPress={() => {
              logout();
              router.replace('/(auth)');
            }}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  logoutButton: {
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '500',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});