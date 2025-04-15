import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ForumTopic, StudyGroup, Challenge } from '@/types/community';
import { Message } from '@/types/chat';

interface CommunityState {
  languagePartners: User[];
  onlineUsers: User[];
  recommendedPartners: User[];
  studyGroups: StudyGroup[];
  forumTopics: ForumTopic[];
  challenges: Challenge[];
  
  // Actions
  fetchPartners: () => void;
  fetchGroups: () => void;
  fetchTopics: () => void;
  getUserById: (id: string) => User | undefined;
  getForumTopicById: (id: string) => ForumTopic | undefined;
  getGroupById: (id: string) => StudyGroup | undefined;
  toggleFavoriteUser: (id: string) => void;
  toggleLikeTopic: (id: string) => void;
  addReplyToTopic: (topicId: string, content: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  toggleNotifications: (groupId: string) => void;
  sendGroupMessage: (groupId: string, text: string) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      languagePartners: [],
      onlineUsers: [],
      recommendedPartners: [],
      studyGroups: [],
      forumTopics: [],
      challenges: [],
      
      fetchPartners: () => {
        // In a real app, this would be an API call
        const mockPartners: User[] = [
          {
            id: '1',
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            nativeLanguage: 'English',
            learningLanguage: 'Spanish',
            proficiencyLevel: 'Intermediate',
            interests: ['Travel', 'Cooking', 'Literature'],
            isOnline: true,
            matchPercentage: 92,
            bio: 'English teacher from London, passionate about Latin American culture. Looking to improve my Spanish through regular conversation practice.',
            location: 'London, UK',
            joinDate: 'Jan 2023',
            connections: 24,
            helpfulRating: 4.8,
            streak: 45,
            learningGoals: [
              'Become conversationally fluent in Spanish',
              'Read "One Hundred Years of Solitude" in original Spanish',
              'Travel to Spain and communicate with locals'
            ],
            recentActivity: [
              {
                type: 'word_list',
                text: 'Created a new word list: "Spanish Food Vocabulary"',
                timeAgo: '2 days ago'
              },
              {
                type: 'forum',
                text: 'Replied to "Tips for rolling your R\'s in Spanish"',
                timeAgo: '5 days ago'
              }
            ],
            achievements: [
              {
                title: '30-Day Streak',
                description: 'Practiced language learning for 30 consecutive days',
                unlocked: true
              },
              {
                title: 'Vocabulary Master',
                description: 'Learned over 500 words in your target language',
                unlocked: true
              },
              {
                title: 'Conversation Pro',
                description: 'Completed 50 conversation exchanges',
                unlocked: false
              }
            ],
            sharedWordLists: [
              {
                id: '101',
                title: 'Spanish Food Vocabulary',
                language: 'Spanish',
                wordCount: 45,
                downloads: 128
              },
              {
                id: '102',
                title: 'Travel Phrases',
                language: 'Spanish',
                wordCount: 30,
                downloads: 87
              }
            ]
          },
          {
            id: '2',
            name: 'Miguel Hernandez',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
            nativeLanguage: 'Spanish',
            learningLanguage: 'English',
            proficiencyLevel: 'Advanced',
            interests: ['Music', 'Sports', 'Technology'],
            isOnline: false,
            matchPercentage: 85,
            bio: 'Software engineer from Madrid. I\'m looking to perfect my English for professional purposes and make friends from around the world.',
            location: 'Madrid, Spain',
            joinDate: 'Mar 2023',
            connections: 18,
            helpfulRating: 4.6,
            streak: 67
          },
          {
            id: '3',
            name: 'Yuki Tanaka',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            nativeLanguage: 'Japanese',
            learningLanguage: 'English',
            proficiencyLevel: 'Intermediate',
            interests: ['Anime', 'Drawing', 'Photography'],
            isOnline: true,
            matchPercentage: 78
          },
          {
            id: '4',
            name: 'Antoine Dubois',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            nativeLanguage: 'French',
            learningLanguage: 'German',
            proficiencyLevel: 'Beginner',
            interests: ['Wine', 'Cinema', 'History'],
            isOnline: false,
            matchPercentage: 65
          },
          {
            id: '5',
            name: 'Sofia Rossi',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
            nativeLanguage: 'Italian',
            learningLanguage: 'Spanish',
            proficiencyLevel: 'Advanced',
            interests: ['Cooking', 'Fashion', 'Travel'],
            isOnline: true,
            matchPercentage: 70
          },
          {
            id: '6',
            name: 'Chen Wei',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
            nativeLanguage: 'Chinese',
            learningLanguage: 'English',
            proficiencyLevel: 'Intermediate',
            interests: ['Business', 'Technology', 'Cooking'],
            isOnline: false,
            matchPercentage: 82
          }
        ];
        
        set({
          languagePartners: mockPartners,
          onlineUsers: mockPartners.filter(partner => partner.isOnline),
          recommendedPartners: mockPartners.filter(partner => partner.matchPercentage && partner.matchPercentage > 75)
        });
      },
      
      fetchGroups: () => {
        // In a real app, this would be an API call
        const mockGroups: StudyGroup[] = [
          {
            id: '1',
            name: 'Spanish Conversation Club',
            description: 'A group for practicing Spanish conversation skills. All levels welcome!',
            language: 'Spanish',
            memberCount: 42,
            activityLevel: 'Very Active',
            isActive: true,
            lastActive: '2 hours ago',
            isMember: true,
            isAdmin: false,
            notificationsEnabled: true,
            members: [
              {
                id: '1',
                name: 'Emma Wilson',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                isAdmin: false,
                isOnline: true,
                joinedDate: '3 months ago'
              },
              {
                id: '7',
                name: 'Carlos Rodriguez',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
                isAdmin: true,
                isOnline: false,
                joinedDate: '6 months ago'
              }
            ],
            messages: [
              {
                id: '101',
                author: 'Carlos Rodriguez',
                authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
                text: 'Hola a todos! Welcome to our weekly discussion. Today\'s topic: favorite travel destinations in Spanish-speaking countries.',
                timeAgo: '2 hours ago'
              },
              {
                id: '102',
                author: 'Emma Wilson',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                text: 'Me encanta Barcelona! I visited last summer and the architecture was amazing.',
                timeAgo: '1 hour ago'
              }
            ],
            resources: [
              {
                id: '201',
                type: 'word_list',
                resourceId: '101',
                title: 'Spanish Travel Vocabulary',
                description: 'Essential words and phrases for traveling in Spanish-speaking countries.',
                author: 'Carlos Rodriguez',
                timeAgo: '1 week ago'
              },
              {
                id: '202',
                type: 'document',
                resourceId: '102',
                title: 'Spanish Conversation Starters',
                description: 'A PDF with 50 conversation starters in Spanish for different situations.',
                author: 'Emma Wilson',
                timeAgo: '3 days ago'
              }
            ],
            events: [
              {
                id: '301',
                title: 'Weekly Spanish Conversation Practice',
                description: 'Join us for our weekly conversation practice session. This week\'s theme: Food and Cooking.',
                date: 'Saturday, 3:00 PM',
                attendees: 15,
                isAttending: true
              },
              {
                id: '302',
                title: 'Spanish Movie Night',
                description: 'We\'ll be watching "Pan\'s Labyrinth" with Spanish audio and English subtitles, followed by a discussion.',
                date: 'Friday, 7:00 PM',
                attendees: 8,
                isAttending: false
              }
            ]
          },
          {
            id: '2',
            name: 'Japanese Beginners',
            description: 'A supportive community for those just starting to learn Japanese.',
            language: 'Japanese',
            memberCount: 28,
            activityLevel: 'Active',
            isActive: false,
            lastActive: '1 day ago',
            isMember: false,
            members: [],
            messages: []
          },
          {
            id: '3',
            name: 'French Literature Club',
            description: 'Discussing French literature classics and contemporary works.',
            language: 'French',
            memberCount: 15,
            activityLevel: 'Moderate',
            isActive: false,
            lastActive: '3 days ago',
            isMember: false,
            members: [],
            messages: []
          }
        ];
        
        set({ studyGroups: mockGroups });
      },
      
      fetchTopics: () => {
        // In a real app, this would be an API call
        const mockTopics: ForumTopic[] = [
          {
            id: '1',
            title: 'Tips for improving listening comprehension in Spanish',
            content: 'I\'ve been learning Spanish for about 6 months now, and while my reading and writing are improving, I still struggle with understanding native speakers. They speak so fast! Does anyone have tips or resources for improving listening comprehension specifically?',
            author: 'Emma Wilson',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            language: 'Spanish',
            timeAgo: '2 days ago',
            likes: 24,
            isLiked: false,
            replies: [
              {
                id: '101',
                content: 'I found that watching Spanish TV shows with Spanish subtitles (not English) helped me a lot. Start with slower shows like documentaries and work your way up to faster dialogue in dramas.',
                author: 'Miguel Hernandez',
                authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                timeAgo: '1 day ago',
                likes: 12,
                dislikes: 0
              },
              {
                id: '102',
                content: 'Try the podcast "Notes in Spanish" - they have beginner, intermediate and advanced levels. The hosts speak clearly but naturally.',
                author: 'Sofia Rossi',
                authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
                timeAgo: '1 day ago',
                likes: 8,
                dislikes: 0
              }
            ]
          },
          {
            id: '2',
            title: 'Best resources for learning Japanese kanji',
            content: 'I\'m looking for effective ways to learn and remember kanji. What apps, books, or methods have worked best for you?',
            author: 'Chen Wei',
            authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
            language: 'Japanese',
            timeAgo: '3 days ago',
            likes: 18,
            isLiked: true,
            replies: []
          },
          {
            id: '3',
            title: 'How to maintain multiple languages without mixing them up?',
            content: 'I\'m currently learning both French and Italian, and I find myself mixing up vocabulary and grammar rules. Has anyone successfully learned similar languages simultaneously?',
            author: 'Antoine Dubois',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            language: 'General',
            timeAgo: '1 week ago',
            likes: 32,
            isLiked: false,
            replies: [
              {
                id: '103',
                content: 'I learned Spanish and Portuguese at the same time. What helped me was to use different "contexts" for each language - like studying Spanish in the morning and Portuguese in the evening, or using different apps for each.',
                author: 'Sofia Rossi',
                authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
                timeAgo: '6 days ago',
                likes: 15,
                dislikes: 1
              }
            ]
          }
        ];
        
        set({ forumTopics: mockTopics });
      },
      
      getUserById: (id: string) => {
        return get().languagePartners.find(partner => partner.id === id);
      },
      
      getForumTopicById: (id: string) => {
        return get().forumTopics.find(topic => topic.id === id);
      },
      
      getGroupById: (id: string) => {
        return get().studyGroups.find(group => group.id === id);
      },
      
      toggleFavoriteUser: (id: string) => {
        set(state => ({
          languagePartners: state.languagePartners.map(partner => 
            partner.id === id 
              ? { ...partner, isFavorite: !partner.isFavorite }
              : partner
          )
        }));
      },
      
      toggleLikeTopic: (id: string) => {
        set(state => ({
          forumTopics: state.forumTopics.map(topic => 
            topic.id === id 
              ? { 
                  ...topic, 
                  isLiked: !topic.isLiked,
                  likes: topic.isLiked ? topic.likes - 1 : topic.likes + 1
                }
              : topic
          )
        }));
      },
      
      addReplyToTopic: (topicId: string, content: string) => {
        const newReply: ForumReply = {
          id: Date.now().toString(),
          content,
          author: 'You', // In a real app, this would be the current user's name
          authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', // In a real app, this would be the current user's avatar
          timeAgo: 'Just now',
          likes: 0,
          dislikes: 0
        };
        
        set(state => ({
          forumTopics: state.forumTopics.map(topic => 
            topic.id === topicId 
              ? { ...topic, replies: [...topic.replies, newReply] }
              : topic
          )
        }));
      },
      
      joinGroup: (groupId: string) => {
        set(state => ({
          studyGroups: state.studyGroups.map(group => 
            group.id === groupId 
              ? { 
                  ...group, 
                  isMember: true,
                  notificationsEnabled: true,
                  memberCount: group.memberCount + 1,
                  members: [
                    ...group.members,
                    {
                      id: 'currentUser', // In a real app, this would be the current user's ID
                      name: 'You', // In a real app, this would be the current user's name
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', // In a real app, this would be the current user's avatar
                      isAdmin: false,
                      isOnline: true,
                      joinedDate: 'Just now'
                    }
                  ]
                }
              : group
          )
        }));
      },
      
      leaveGroup: (groupId: string) => {
        set(state => ({
          studyGroups: state.studyGroups.map(group => 
            group.id === groupId 
              ? { 
                  ...group, 
                  isMember: false,
                  memberCount: group.memberCount - 1,
                  members: group.members.filter(member => member.id !== 'currentUser')
                }
              : group
          )
        }));
      },
      
      toggleNotifications: (groupId: string) => {
        set(state => ({
          studyGroups: state.studyGroups.map(group => 
            group.id === groupId 
              ? { ...group, notificationsEnabled: !group.notificationsEnabled }
              : group
          )
        }));
      },
      
      sendGroupMessage: (groupId: string, text: string) => {
        const newMessage = {
          id: Date.now().toString(),
          author: 'You', // In a real app, this would be the current user's name
          authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', // In a real app, this would be the current user's avatar
          text,
          timeAgo: 'Just now'
        };
        
        set(state => ({
          studyGroups: state.studyGroups.map(group => 
            group.id === groupId 
              ? { ...group, messages: [...group.messages, newMessage] }
              : group
          )
        }));
      }
    }),
    {
      name: 'community-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);