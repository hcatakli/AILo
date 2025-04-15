import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Calendar, MessageCircle, BookOpen, Send, MoreVertical, Bell, BellOff, Share2, LogOut } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useCommunityStore } from '@/store/community-store';

export default function GroupScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('discussions');
  
  const { getGroupById, joinGroup, leaveGroup, toggleNotifications, sendGroupMessage } = useCommunityStore();
  const group = getGroupById(id as string);
  
  if (!group) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Group not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={styles.notFoundButton}
        />
      </View>
    );
  }
  
  const handleSendMessage = () => {
    if (message.trim()) {
      sendGroupMessage(id as string, message);
      setMessage('');
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussions':
        return (
          <View style={styles.tabContent}>
            <View style={styles.chatContainer}>
              {group.messages.map((msg, index) => (
                <View key={index} style={styles.messageItem}>
                  <Image source={{ uri: msg.authorAvatar }} style={styles.messageAvatar} />
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageSender}>{msg.author}</Text>
                      <Text style={styles.messageTime}>{msg.timeAgo}</Text>
                    </View>
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                </View>
              ))}
              
              {group.messages.length === 0 && (
                <Text style={styles.emptyMessages}>
                  No messages yet. Start the conversation!
                </Text>
              )}
            </View>
            
            {group.isMember && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    !message.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
        
      case 'resources':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Shared Resources</Text>
            
            {group.resources?.map((resource, index) => (
              <Card key={index} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <View style={[styles.resourceIcon, { backgroundColor: getResourceColor(resource.type) }]}>
                    {resource.type === 'word_list' && <BookOpen size={16} color={colors.white} />}
                    {resource.type === 'document' && <BookOpen size={16} color={colors.white} />}
                    {resource.type === 'link' && <Globe size={16} color={colors.white} />}
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceMeta}>
                      Shared by {resource.author} • {resource.timeAgo}
                    </Text>
                  </View>
                </View>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
                <Button
                  title={resource.type === 'word_list' ? 'View List' : resource.type === 'link' ? 'Open Link' : 'View Document'}
                  onPress={() => {
                    if (resource.type === 'word_list') {
                      router.push(`/list/${resource.resourceId}`);
                    }
                  }}
                  variant="outline"
                  size="small"
                  style={styles.resourceButton}
                />
              </Card>
            ))}
            
            {(!group.resources || group.resources.length === 0) && (
              <Text style={styles.emptyResources}>
                No resources have been shared in this group yet.
              </Text>
            )}
            
            {group.isMember && (
              <Button
                title="Share a Resource"
                onPress={() => router.push(`/community/groups/share-resource/${id}`)}
                variant="primary"
                style={styles.shareButton}
              />
            )}
          </View>
        );
        
      case 'members':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Members ({group.members.length})</Text>
            
            <FlatList
              data={group.members}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.memberItem}
                  onPress={() => router.push(`/community/profile/${item.id}`)}
                >
                  <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberRole}>
                      {item.isAdmin ? 'Admin' : 'Member'} • {item.joinedDate}
                    </Text>
                  </View>
                  {item.isOnline && (
                    <View style={styles.onlineIndicator} />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        );
        
      case 'events':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            
            {group.events?.map((event, index) => (
              <Card key={index} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Calendar size={20} color={colors.primary} />
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <View style={styles.eventFooter}>
                  <Text style={styles.eventAttendees}>
                    {event.attendees} attending
                  </Text>
                  <Button
                    title={event.isAttending ? 'Attending' : 'Attend'}
                    onPress={() => {}}
                    variant={event.isAttending ? 'outline' : 'primary'}
                    size="small"
                  />
                </View>
              </Card>
            ))}
            
            {(!group.events || group.events.length === 0) && (
              <Text style={styles.emptyEvents}>
                No upcoming events scheduled.
              </Text>
            )}
            
            {group.isMember && group.isAdmin && (
              <Button
                title="Create Event"
                onPress={() => router.push(`/community/groups/create-event/${id}`)}
                variant="primary"
                style={styles.createEventButton}
              />
            )}
          </View>
        );
        
      default:
        return null;
    }
  };
  
  const getResourceColor = (type: string) => {
    switch (type) {
      case 'word_list':
        return colors.primary;
      case 'document':
        return '#4CAF50';
      case 'link':
        return '#2196F3';
      default:
        return colors.primary;
    }
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: group.name,
          headerRight: () => (
            <TouchableOpacity>
              <MoreVertical size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.groupIconContainer}>
              <Users size={32} color={colors.white} />
            </View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescription}>{group.description}</Text>
            
            <View style={styles.groupStats}>
              <View style={styles.groupStat}>
                <Text style={styles.statValue}>{group.memberCount}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.groupStat}>
                <Text style={styles.statValue}>{group.language}</Text>
                <Text style={styles.statLabel}>Language</Text>
              </View>
              <View style={styles.groupStat}>
                <Text style={styles.statValue}>{group.activityLevel}</Text>
                <Text style={styles.statLabel}>Activity</Text>
              </View>
            </View>
            
            <View style={styles.groupActions}>
              {group.isMember ? (
                <>
                  <Button
                    title={group.notificationsEnabled ? 'Mute' : 'Unmute'}
                    onPress={() => toggleNotifications(id as string)}
                    icon={group.notificationsEnabled ? 
                      <BellOff size={18} color={colors.white} /> : 
                      <Bell size={18} color={colors.white} />
                    }
                    variant="secondary"
                    style={styles.actionButton}
                  />
                  <Button
                    title="Share"
                    onPress={() => {}}
                    icon={<Share2 size={18} color={colors.white} />}
                    variant="secondary"
                    style={styles.actionButton}
                  />
                  <Button
                    title="Leave"
                    onPress={() => leaveGroup(id as string)}
                    icon={<LogOut size={18} color={colors.white} />}
                    variant="outline"
                    style={styles.actionButton}
                  />
                </>
              ) : (
                <Button
                  title="Join Group"
                  onPress={() => joinGroup(id as string)}
                  style={styles.joinButton}
                />
              )}
            </View>
          </View>
          
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'discussions' && styles.activeTab]}
              onPress={() => setActiveTab('discussions')}
            >
              <MessageCircle size={20} color={activeTab === 'discussions' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'discussions' && styles.activeTabText]}>
                Discussions
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
              onPress={() => setActiveTab('resources')}
            >
              <BookOpen size={20} color={activeTab === 'resources' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
                Resources
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'members' && styles.activeTab]}
              onPress={() => setActiveTab('members')}
            >
              <Users size={20} color={activeTab === 'members' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
                Members
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'events' && styles.activeTab]}
              onPress={() => setActiveTab('events')}
            >
              <Calendar size={20} color={activeTab === 'events' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>
          
          {renderTabContent()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  groupDescription: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  groupStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  joinButton: {
    width: '80%',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  chatContainer: {
    marginBottom: 70, // Space for input
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  emptyMessages: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  resourceCard: {
    marginBottom: 16,
    padding: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  resourceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  resourceMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  resourceDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  resourceButton: {
    alignSelf: 'flex-start',
  },
  emptyResources: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  shareButton: {
    marginTop: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  memberRole: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  eventCard: {
    marginBottom: 16,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventAttendees: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyEvents: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  createEventButton: {
    marginTop: 16,
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