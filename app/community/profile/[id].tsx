import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Star, Award, Flag, Share2, BarChart, BookOpen, Users, Globe, Calendar, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { useCommunityStore } from '@/store/community-store';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  
  const { getUserById, toggleFavoriteUser } = useCommunityStore();
  const user = getUserById(id as string);
  
  if (!user) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>User not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={styles.notFoundButton}
        />
      </View>
    );
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bio}>{user.bio}</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>Joined {user.joinDate}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{user.location}</Text>
                </View>
              </View>
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Languages</Text>
              
              <View style={styles.languageItem}>
                <View style={styles.languageHeader}>
                  <Text style={styles.languageName}>{user.nativeLanguage} (Native)</Text>
                  <Text style={styles.languageLevel}>Fluent</Text>
                </View>
                <ProgressBar progress={1} style={styles.languageProgress} />
              </View>
              
              <View style={styles.languageItem}>
                <View style={styles.languageHeader}>
                  <Text style={styles.languageName}>{user.learningLanguage}</Text>
                  <Text style={styles.languageLevel}>{user.proficiencyLevel}</Text>
                </View>
                <ProgressBar 
                  progress={
                    user.proficiencyLevel === 'Beginner' ? 0.2 :
                    user.proficiencyLevel === 'Intermediate' ? 0.5 :
                    user.proficiencyLevel === 'Advanced' ? 0.8 : 0.3
                  } 
                  style={styles.languageProgress} 
                />
              </View>
              
              {user.otherLanguages?.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <View style={styles.languageHeader}>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    <Text style={styles.languageLevel}>{lang.level}</Text>
                  </View>
                  <ProgressBar 
                    progress={
                      lang.level === 'Beginner' ? 0.2 :
                      lang.level === 'Intermediate' ? 0.5 :
                      lang.level === 'Advanced' ? 0.8 : 0.3
                    } 
                    style={styles.languageProgress} 
                  />
                </View>
              ))}
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interestsContainer}>
                {user.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Learning Goals</Text>
              {user.learningGoals?.map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <Award size={16} color={colors.primary} />
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </Card>
          </View>
        );
        
      case 'activity':
        return (
          <View style={styles.tabContent}>
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              
              {user.recentActivity?.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    {activity.type === 'word_list' && <BookOpen size={16} color={colors.white} />}
                    {activity.type === 'forum' && <MessageCircle size={16} color={colors.white} />}
                    {activity.type === 'challenge' && <Award size={16} color={colors.white} />}
                    {activity.type === 'group' && <Users size={16} color={colors.white} />}
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{activity.text}</Text>
                    <Text style={styles.activityTime}>{activity.timeAgo}</Text>
                  </View>
                </View>
              ))}
              
              {(!user.recentActivity || user.recentActivity.length === 0) && (
                <Text style={styles.emptyText}>No recent activity</Text>
              )}
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Learning Streak</Text>
              <View style={styles.streakContainer}>
                <View style={styles.streakInfo}>
                  <Text style={styles.streakCount}>{user.streak || 0}</Text>
                  <Text style={styles.streakLabel}>days</Text>
                </View>
                <View style={styles.streakCalendar}>
                  {/* Calendar visualization would go here */}
                  <Text style={styles.streakText}>
                    {user.streak ? `${user.name} has been learning for ${user.streak} days in a row!` : 'No active streak'}
                  </Text>
                </View>
              </View>
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <View style={styles.achievementsContainer}>
                {user.achievements?.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <View style={[
                      styles.achievementIcon,
                      achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                    ]}>
                      <Award size={24} color={achievement.unlocked ? colors.white : colors.textSecondary} />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={[
                        styles.achievementTitle,
                        !achievement.unlocked && styles.achievementTitleLocked
                      ]}>
                        {achievement.title}
                      </Text>
                      <Text style={styles.achievementDescription}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                ))}
                
                {(!user.achievements || user.achievements.length === 0) && (
                  <Text style={styles.emptyText}>No achievements yet</Text>
                )}
              </View>
            </Card>
          </View>
        );
        
      case 'resources':
        return (
          <View style={styles.tabContent}>
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Shared Word Lists</Text>
              
              {user.sharedWordLists?.map((list, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.resourceItem}
                  onPress={() => router.push(`/list/${list.id}`)}
                >
                  <View style={styles.resourceIconContainer}>
                    <BookOpen size={16} color={colors.white} />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{list.title}</Text>
                    <Text style={styles.resourceMeta}>
                      {list.wordCount} words • {list.language}
                    </Text>
                  </View>
                  <Text style={styles.resourceDownloads}>
                    {list.downloads} downloads
                  </Text>
                </TouchableOpacity>
              ))}
              
              {(!user.sharedWordLists || user.sharedWordLists.length === 0) && (
                <Text style={styles.emptyText}>No shared word lists</Text>
              )}
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Forum Contributions</Text>
              
              {user.forumPosts?.map((post, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.resourceItem}
                  onPress={() => router.push(`/community/forum/${post.id}`)}
                >
                  <View style={[styles.resourceIconContainer, { backgroundColor: colors.secondary }]}>
                    <MessageCircle size={16} color={colors.white} />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{post.title}</Text>
                    <Text style={styles.resourceMeta}>
                      {post.timeAgo} • {post.replies} replies
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              {(!user.forumPosts || user.forumPosts.length === 0) && (
                <Text style={styles.emptyText}>No forum contributions</Text>
              )}
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Study Groups</Text>
              
              {user.studyGroups?.map((group, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.resourceItem}
                  onPress={() => router.push(`/community/groups/${group.id}`)}
                >
                  <View style={[styles.resourceIconContainer, { backgroundColor: '#9C27B0' }]}>
                    <Users size={16} color={colors.white} />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{group.name}</Text>
                    <Text style={styles.resourceMeta}>
                      {group.memberCount} members • {group.language}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              {(!user.studyGroups || user.studyGroups.length === 0) && (
                <Text style={styles.emptyText}>Not a member of any study groups</Text>
              )}
            </Card>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: user.coverPhoto || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop' }} 
            style={styles.coverPhoto} 
          />
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.languageBadge}>
                <Globe size={14} color={colors.primary} />
                <Text style={styles.languageBadgeText}>
                  {user.nativeLanguage} → {user.learningLanguage}
                </Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.connections || 0}</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.helpfulRating || 0}</Text>
                <Text style={styles.statLabel}>Helpful Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.streak || 0}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <Button
            title="Message"
            onPress={() => router.push(`/community/chat/${id}`)}
            icon={<MessageCircle size={18} color={colors.white} />}
            style={styles.messageButton}
          />
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleFavoriteUser(id as string)}
          >
            <Star 
              size={22} 
              color={user.isFavorite ? colors.warning : colors.textSecondary} 
              fill={user.isFavorite ? colors.warning : 'transparent'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Flag size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
            onPress={() => setActiveTab('activity')}
          >
            <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
              Activity
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
            onPress={() => setActiveTab('resources')}
          >
            <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
              Resources
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderTabContent()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: 150,
  },
  profileInfo: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.background,
    marginTop: -40,
  },
  nameContainer: {
    marginTop: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  languageBadgeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  messageButton: {
    flex: 1,
    marginRight: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingVertical: 14,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabContent: {
    padding: 20,
  },
  infoCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  languageItem: {
    marginBottom: 16,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  languageLevel: {
    fontSize: 14,
    color: colors.primary,
  },
  languageProgress: {
    height: 6,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakInfo: {
    alignItems: 'center',
    marginRight: 16,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streakCalendar: {
    flex: 1,
  },
  streakText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  achievementsContainer: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementUnlocked: {
    backgroundColor: colors.primary,
  },
  achievementLocked: {
    backgroundColor: colors.backgroundAlt,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: colors.textSecondary,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resourceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  resourceMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resourceDownloads: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  notFoundButton: {
    width: 200,
  },
});