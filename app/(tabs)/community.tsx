import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MessageCircle, Users, Globe, BookOpen, Award } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCommunityStore } from '@/store/community-store';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { ProgressBar } from '@/components/ProgressBar';
import { UserCard } from '@/components/UserCard';
import { EmptyState } from '@/components/EmptyState';

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('partners');
  const { 
    languagePartners, 
    onlineUsers, 
    recommendedPartners,
    studyGroups,
    forumTopics,
    fetchPartners,
    fetchGroups,
    fetchTopics
  } = useCommunityStore();

  // Fetch data on component mount
  React.useEffect(() => {
    fetchPartners();
    fetchGroups();
    fetchTopics();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'partners':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Find Language Partners</Text>
            <View style={styles.searchContainer}>
              <Input
                placeholder="Search by language, interests, or location"
                leftIcon={<Search size={20} color={colors.textSecondary} />}
                style={styles.searchInput}
              />
            </View>
            
            <Text style={styles.subheading}>Recommended for You</Text>
            {recommendedPartners.length > 0 ? (
              <FlatList
                data={recommendedPartners}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <UserCard
                    user={item}
                    onPress={() => router.push(`/community/profile/${item.id}`)}
                    style={styles.partnerCard}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.recommendedList}
              />
            ) : (
              <EmptyState
                icon={<Users size={40} color={colors.primary} />}
                title="No recommendations yet"
                message="Complete your profile to get personalized partner recommendations"
                action={
                  <Button 
                    title="Complete Profile" 
                    onPress={() => router.push('/community/profile/edit')}
                    variant="secondary"
                    size="small"
                  />
                }
              />
            )}
            
            <Text style={styles.subheading}>Online Now ({onlineUsers.length})</Text>
            {onlineUsers.length > 0 ? (
              <FlatList
                data={onlineUsers}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <UserCard
                    user={item}
                    onPress={() => router.push(`/community/chat/${item.id}`)}
                    style={styles.partnerCard}
                    showOnlineStatus
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.onlineList}
              />
            ) : (
              <Text style={styles.emptyText}>No users online at the moment</Text>
            )}
            
            <View style={styles.actionButtons}>
              <Button
                title="Browse All Partners"
                onPress={() => router.push('/community/partners')}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="My Connections"
                onPress={() => router.push('/community/connections')}
                variant="outline"
                style={styles.actionButton}
              />
            </View>
          </View>
        );
        
      case 'groups':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Study Groups</Text>
            <View style={styles.searchContainer}>
              <Input
                placeholder="Search study groups"
                leftIcon={<Search size={20} color={colors.textSecondary} />}
                style={styles.searchInput}
              />
            </View>
            
            {studyGroups.length > 0 ? (
              <FlatList
                data={studyGroups}
                renderItem={({ item }) => (
                  <Card style={styles.groupCard} onPress={() => router.push(`/community/groups/${item.id}`)}>
                    <View style={styles.groupHeader}>
                      <View style={styles.groupIconContainer}>
                        <BookOpen size={24} color={colors.white} />
                      </View>
                      <View style={styles.groupInfo}>
                        <Text style={styles.groupName}>{item.name}</Text>
                        <Text style={styles.groupMembers}>{item.memberCount} members • {item.language}</Text>
                      </View>
                    </View>
                    <Text style={styles.groupDescription}>{item.description}</Text>
                    <View style={styles.groupFooter}>
                      <Text style={styles.groupActivity}>
                        {item.isActive ? 'Active now' : `Last active ${item.lastActive}`}
                      </Text>
                      <Button
                        title={item.isMember ? 'View' : 'Join'}
                        onPress={() => router.push(`/community/groups/${item.id}`)}
                        variant={item.isMember ? 'outline' : 'primary'}
                        size="small"
                      />
                    </View>
                  </Card>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.groupsList}
              />
            ) : (
              <EmptyState
                icon={<Users size={40} color={colors.primary} />}
                title="No study groups yet"
                message="Create a study group or join existing ones to learn together"
                action={
                  <Button 
                    title="Create Group" 
                    onPress={() => router.push('/community/groups/create')}
                    variant="primary"
                    size="small"
                  />
                }
              />
            )}
            
            <Button
              title="Create New Group"
              onPress={() => router.push('/community/groups/create')}
              variant="primary"
              style={styles.createButton}
            />
          </View>
        );
        
      case 'forum':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Language Learning Forum</Text>
            <View style={styles.searchContainer}>
              <Input
                placeholder="Search topics"
                leftIcon={<Search size={20} color={colors.textSecondary} />}
                style={styles.searchInput}
              />
            </View>
            
            {forumTopics.length > 0 ? (
              <FlatList
                data={forumTopics}
                renderItem={({ item }) => (
                  <Card style={styles.topicCard} onPress={() => router.push(`/community/forum/${item.id}`)}>
                    <View style={styles.topicHeader}>
                      <Image source={{ uri: item.authorAvatar }} style={styles.topicAuthorAvatar} />
                      <View style={styles.topicInfo}>
                        <Text style={styles.topicTitle}>{item.title}</Text>
                        <Text style={styles.topicMeta}>
                          by {item.author} • {item.language} • {item.timeAgo}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.topicStats}>
                      <View style={styles.topicStat}>
                        <MessageCircle size={16} color={colors.textSecondary} />
                        <Text style={styles.topicStatText}>{item.replies}</Text>
                      </View>
                      <View style={styles.topicStat}>
                        <Award size={16} color={colors.textSecondary} />
                        <Text style={styles.topicStatText}>{item.likes}</Text>
                      </View>
                    </View>
                  </Card>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.topicsList}
              />
            ) : (
              <EmptyState
                icon={<MessageCircle size={40} color={colors.primary} />}
                title="No forum topics yet"
                message="Start a conversation or ask a question to get help from the community"
                action={
                  <Button 
                    title="New Topic" 
                    onPress={() => router.push('/community/forum/create')}
                    variant="primary"
                    size="small"
                  />
                }
              />
            )}
            
            <Button
              title="Start New Topic"
              onPress={() => router.push('/community/forum/create')}
              variant="primary"
              style={styles.createButton}
            />
          </View>
        );
        
      case 'challenges':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Language Challenges</Text>
            
            <Card style={styles.featuredChallengeCard}>
              <View style={styles.challengeBadge}>
                <Text style={styles.challengeBadgeText}>FEATURED</Text>
              </View>
              <Text style={styles.challengeTitle}>30-Day Speaking Challenge</Text>
              <Text style={styles.challengeDescription}>
                Practice speaking for 5 minutes every day for 30 days. Share your progress with the community.
              </Text>
              <View style={styles.challengeStats}>
                <Text style={styles.challengeParticipants}>1,245 participants</Text>
                <Text style={styles.challengeDays}>14 days left</Text>
              </View>
              <ProgressBar progress={0.53} style={styles.challengeProgress} />
              <Button
                title="Join Challenge"
                onPress={() => router.push('/community/challenges/speaking')}
                variant="primary"
                style={styles.challengeButton}
              />
            </Card>
            
            <Text style={styles.subheading}>More Challenges</Text>
            <Card style={styles.challengeCard}>
              <Text style={styles.challengeCardTitle}>Vocabulary Builder</Text>
              <Text style={styles.challengeCardDescription}>
                Learn 10 new words every day for 21 days
              </Text>
              <View style={styles.challengeCardFooter}>
                <Text style={styles.challengeCardParticipants}>876 participants</Text>
                <Button
                  title="View"
                  onPress={() => router.push('/community/challenges/vocabulary')}
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
            
            <Card style={styles.challengeCard}>
              <Text style={styles.challengeCardTitle}>Grammar Master</Text>
              <Text style={styles.challengeCardDescription}>
                Complete daily grammar exercises for 14 days
              </Text>
              <View style={styles.challengeCardFooter}>
                <Text style={styles.challengeCardParticipants}>543 participants</Text>
                <Button
                  title="View"
                  onPress={() => router.push('/community/challenges/grammar')}
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
            
            <Button
              title="See All Challenges"
              onPress={() => router.push('/community/challenges')}
              variant="secondary"
              style={styles.seeAllButton}
            />
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'partners' && styles.activeTab]}
          onPress={() => setActiveTab('partners')}
        >
          <Users size={20} color={activeTab === 'partners' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'partners' && styles.activeTabText]}>Partners</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <BookOpen size={20} color={activeTab === 'groups' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'forum' && styles.activeTab]}
          onPress={() => setActiveTab('forum')}
        >
          <MessageCircle size={20} color={activeTab === 'forum' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'forum' && styles.activeTabText]}>Forum</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Award size={20} color={activeTab === 'challenges' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>Challenges</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    marginBottom: 0,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  recommendedList: {
    paddingBottom: 16,
  },
  onlineList: {
    paddingBottom: 16,
  },
  partnerCard: {
    width: 160,
    marginRight: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  groupCard: {
    marginBottom: 16,
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  groupMembers: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  groupDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupActivity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  groupsList: {
    paddingBottom: 16,
  },
  createButton: {
    marginTop: 8,
  },
  topicCard: {
    marginBottom: 12,
    padding: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicAuthorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  topicMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  topicStats: {
    flexDirection: 'row',
  },
  topicStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  topicStatText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  topicsList: {
    paddingBottom: 16,
  },
  featuredChallengeCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 0,
    backgroundColor: colors.cardAlt,
  },
  challengeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  challengeBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  challengeParticipants: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  challengeDays: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  challengeProgress: {
    marginBottom: 16,
  },
  challengeButton: {
    marginTop: 8,
  },
  challengeCard: {
    padding: 16,
    marginBottom: 12,
  },
  challengeCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  challengeCardDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeCardParticipants: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  seeAllButton: {
    marginTop: 8,
  },
});