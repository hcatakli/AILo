export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  nativeLanguage: string;
  learningLanguage: string;
  proficiencyLevel: string;
  otherLanguages?: {
    name: string;
    level: string;
  }[];
  bio?: string;
  location?: string;
  joinDate?: string;
  interests: string[];
  isOnline: boolean;
  matchPercentage?: number;
  isFavorite?: boolean;
  connections?: number;
  helpfulRating?: number;
  streak?: number;
  learningGoals?: string[];
  recentActivity?: {
    type: 'word_list' | 'forum' | 'challenge' | 'group';
    text: string;
    timeAgo: string;
  }[];
  achievements?: {
    title: string;
    description: string;
    unlocked: boolean;
  }[];
  sharedWordLists?: {
    id: string;
    title: string;
    language: string;
    wordCount: number;
    downloads: number;
  }[];
  forumPosts?: {
    id: string;
    title: string;
    timeAgo: string;
    replies: number;
  }[];
  studyGroups?: {
    id: string;
    name: string;
    language: string;
    memberCount: number;
  }[];
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  language: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  likes: number;
  dislikes: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  language: string;
  memberCount: number;
  activityLevel: string;
  isActive: boolean;
  lastActive: string;
  isMember: boolean;
  isAdmin?: boolean;
  notificationsEnabled?: boolean;
  members: {
    id: string;
    name: string;
    avatar: string;
    isAdmin: boolean;
    isOnline: boolean;
    joinedDate: string;
  }[];
  messages: {
    id: string;
    author: string;
    authorAvatar: string;
    text: string;
    timeAgo: string;
  }[];
  resources?: {
    id: string;
    type: 'word_list' | 'document' | 'link';
    resourceId: string;
    title: string;
    description: string;
    author: string;
    timeAgo: string;
  }[];
  events?: {
    id: string;
    title: string;
    description: string;
    date: string;
    attendees: number;
    isAttending: boolean;
  }[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  daysLeft: number;
  participants: number;
  progress: number;
  isJoined: boolean;
}