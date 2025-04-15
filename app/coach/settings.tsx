import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  MessageCircle, 
  Bell, 
  BookOpen, 
  Headphones, 
  Pencil, 
  BookText 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { useCoachStore } from '@/store/coach-store';

export default function CoachSettingsScreen() {
  const { settings, updateSettings } = useCoachStore();
  
  const handleToggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };
  
  const handleToggleFocusArea = (area: string) => {
    const currentAreas = settings.focusAreas;
    if (currentAreas.includes(area as any)) {
      updateSettings({
        focusAreas: currentAreas.filter(a => a !== area)
      });
    } else {
      updateSettings({
        focusAreas: [...currentAreas, area as any]
      });
    }
  };
  
  const handleChangeConversationStyle = (style: typeof settings.conversationStyle) => {
    updateSettings({ conversationStyle: style });
  };
  
  const handleChangeReminderFrequency = (frequency: typeof settings.reminderFrequency) => {
    updateSettings({ reminderFrequency: frequency });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Coach Settings" />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Settings size={20} color={colors.text} />
                <Text style={styles.settingText}>Enable AI Coach</Text>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={() => handleToggleSetting('enabled')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.enabled ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Settings size={20} color={colors.text} />
                <Text style={styles.settingText}>Show on Home Screen</Text>
              </View>
              <Switch
                value={settings.showOnHomeScreen}
                onValueChange={() => handleToggleSetting('showOnHomeScreen')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.showOnHomeScreen ? colors.primary : colors.card}
              />
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation Style</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.radioGroup}>
              <TouchableRadio
                label="Formal"
                selected={settings.conversationStyle === 'formal'}
                onSelect={() => handleChangeConversationStyle('formal')}
              />
              <TouchableRadio
                label="Casual"
                selected={settings.conversationStyle === 'casual'}
                onSelect={() => handleChangeConversationStyle('casual')}
              />
              <TouchableRadio
                label="Encouraging"
                selected={settings.conversationStyle === 'encouraging'}
                onSelect={() => handleChangeConversationStyle('encouraging')}
              />
              <TouchableRadio
                label="Direct"
                selected={settings.conversationStyle === 'direct'}
                onSelect={() => handleChangeConversationStyle('direct')}
              />
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Frequency</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.radioGroup}>
              <TouchableRadio
                label="Daily"
                selected={settings.reminderFrequency === 'daily'}
                onSelect={() => handleChangeReminderFrequency('daily')}
              />
              <TouchableRadio
                label="Weekly"
                selected={settings.reminderFrequency === 'weekly'}
                onSelect={() => handleChangeReminderFrequency('weekly')}
              />
              <TouchableRadio
                label="Monthly"
                selected={settings.reminderFrequency === 'monthly'}
                onSelect={() => handleChangeReminderFrequency('monthly')}
              />
              <TouchableRadio
                label="None"
                selected={settings.reminderFrequency === 'none'}
                onSelect={() => handleChangeReminderFrequency('none')}
              />
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Areas</Text>
          <Text style={styles.sectionDescription}>
            Select the language skills you want your coach to focus on
          </Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.focusAreaItem}>
              <View style={styles.focusAreaInfo}>
                <View style={[styles.focusAreaIcon, { backgroundColor: colors.primary }]}>
                  <BookOpen size={16} color={colors.white} />
                </View>
                <Text style={styles.focusAreaText}>Vocabulary</Text>
              </View>
              <Switch
                value={settings.focusAreas.includes('vocabulary')}
                onValueChange={() => handleToggleFocusArea('vocabulary')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.focusAreas.includes('vocabulary') ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.focusAreaItem}>
              <View style={styles.focusAreaInfo}>
                <View style={[styles.focusAreaIcon, { backgroundColor: colors.secondary }]}>
                  <MessageCircle size={16} color={colors.white} />
                </View>
                <Text style={styles.focusAreaText}>Grammar</Text>
              </View>
              <Switch
                value={settings.focusAreas.includes('grammar')}
                onValueChange={() => handleToggleFocusArea('grammar')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.focusAreas.includes('grammar') ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.focusAreaItem}>
              <View style={styles.focusAreaInfo}>
                <View style={[styles.focusAreaIcon, { backgroundColor: '#FF9800' }]}>
                  <MessageCircle size={16} color={colors.white} />
                </View>
                <Text style={styles.focusAreaText}>Speaking</Text>
              </View>
              <Switch
                value={settings.focusAreas.includes('speaking')}
                onValueChange={() => handleToggleFocusArea('speaking')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.focusAreas.includes('speaking') ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.focusAreaItem}>
              <View style={styles.focusAreaInfo}>
                <View style={[styles.focusAreaIcon, { backgroundColor: '#9C27B0' }]}>
                  <Headphones size={16} color={colors.white} />
                </View>
                <Text style={styles.focusAreaText}>Listening</Text>
              </View>
              <Switch
                value={settings.focusAreas.includes('listening')}
                onValueChange={() => handleToggleFocusArea('listening')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.focusAreas.includes('listening') ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.focusAreaItem}>
              <View style={styles.focusAreaInfo}>
                <View style={[styles.focusAreaIcon, { backgroundColor: '#4CAF50' }]}>
                  <BookText size={16} color={colors.white} />
                </View>
                <Text style={styles.focusAreaText}>Reading</Text>
              </View>
              <Switch
                value={settings.focusAreas.includes('reading')}
                onValueChange={() => handleToggleFocusArea('reading')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.focusAreas.includes('reading') ? colors.primary : colors.card}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.focusAreaItem}>
              <View style={styles.focusAreaInfo}>
                <View style={[styles.focusAreaIcon, { backgroundColor: '#00BCD4' }]}>
                  <Pencil size={16} color={colors.white} />
                </View>
                <Text style={styles.focusAreaText}>Writing</Text>
              </View>
              <Switch
                value={settings.focusAreas.includes('writing')}
                onValueChange={() => handleToggleFocusArea('writing')}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.focusAreas.includes('writing') ? colors.primary : colors.card}
              />
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={colors.text} />
                <Text style={styles.settingText}>Coach Recommendations</Text>
              </View>
              <Switch
                value={settings.reminderFrequency !== 'none'}
                onValueChange={() => 
                  updateSettings({ 
                    reminderFrequency: settings.reminderFrequency === 'none' ? 'daily' : 'none' 
                  })
                }
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={settings.reminderFrequency !== 'none' ? colors.primary : colors.card}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// TouchableRadio component
const TouchableRadio = ({ 
  label, 
  selected, 
  onSelect 
}: { 
  label: string; 
  selected: boolean; 
  onSelect: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onSelect}>
      <View style={[
        styles.radioOuter,
        selected && styles.radioOuterSelected
      ]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[
        styles.radioLabel,
        selected && styles.radioLabelSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  settingCard: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text,
  },
  radioLabelSelected: {
    fontWeight: '500',
  },
  focusAreaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  focusAreaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusAreaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  focusAreaText: {
    fontSize: 16,
    color: colors.text,
  },
});