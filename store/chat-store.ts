import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Chat } from '@/types/chat';

interface ChatState {
  chats: Chat[];
  messages: Message[];
  
  // Actions
  sendMessage: (message: Message) => void;
  loadMessages: (chatId: string) => void;
  markAsRead: (chatId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [
        {
          id: '1',
          participants: ['currentUser', '1'],
          unreadCount: 2
        },
        {
          id: '2',
          participants: ['currentUser', '2'],
          unreadCount: 0
        }
      ],
      messages: [
        {
          id: '1',
          chatId: '1',
          senderId: '1',
          text: 'Hi there! I saw that you\'re learning Spanish. How\'s it going so far?',
          timestamp: '2023-06-15T14:30:00Z',
          status: 'read'
        },
        {
          id: '2',
          chatId: '1',
          senderId: 'currentUser',
          text: 'Hello! Yes, I\'ve been studying for about 6 months now. I can read pretty well, but speaking is still challenging.',
          timestamp: '2023-06-15T14:35:00Z',
          status: 'read'
        },
        {
          id: '3',
          chatId: '1',
          senderId: '1',
          text: 'That\'s normal! Speaking takes more practice. Would you like to schedule a conversation practice session sometime?',
          timestamp: '2023-06-15T14:40:00Z',
          status: 'read'
        },
        {
          id: '4',
          chatId: '1',
          senderId: 'currentUser',
          text: 'That would be great! When are you usually available?',
          timestamp: '2023-06-15T14:45:00Z',
          status: 'read'
        },
        {
          id: '5',
          chatId: '1',
          senderId: '1',
          text: 'I\'m free most evenings after 6pm (GMT). How about this Thursday?',
          timestamp: '2023-06-15T14:50:00Z',
          status: 'read'
        },
        {
          id: '6',
          chatId: '1',
          senderId: '1',
          text: 'By the way, have you tried watching Spanish TV shows? That helped me a lot when I was learning English.',
          timestamp: '2023-06-16T09:15:00Z',
          status: 'delivered'
        },
        {
          id: '7',
          chatId: '1',
          senderId: '1',
          text: 'I can recommend some good ones with subtitles if you\'re interested!',
          timestamp: '2023-06-16T09:16:00Z',
          status: 'delivered'
        },
        {
          id: '8',
          chatId: '2',
          senderId: '2',
          text: 'Hola! I noticed you\'re learning Spanish. I\'m a native speaker and would be happy to help.',
          timestamp: '2023-06-14T10:20:00Z',
          status: 'read'
        },
        {
          id: '9',
          chatId: '2',
          senderId: 'currentUser',
          text: 'That would be amazing! I\'m particularly struggling with the subjunctive mood.',
          timestamp: '2023-06-14T10:25:00Z',
          status: 'read'
        },
        {
          id: '10',
          chatId: '2',
          senderId: '2',
          text: 'Ah, the subjunctive is tricky for many learners. Let\'s work on some examples together.',
          timestamp: '2023-06-14T10:30:00Z',
          status: 'read'
        }
      ],
      
      sendMessage: (message: Message) => {
        set(state => ({
          messages: [...state.messages, message],
          chats: state.chats.map(chat => 
            chat.id === message.chatId 
              ? { 
                  ...chat, 
                  lastMessage: message,
                  unreadCount: message.senderId === 'currentUser' ? chat.unreadCount : chat.unreadCount + 1
                }
              : chat
          )
        }));
      },
      
      loadMessages: (chatId: string) => {
        // In a real app, this would load messages from an API
        // Here we're just marking messages as read
        set(state => ({
          messages: state.messages.map(message => 
            message.chatId === chatId && message.senderId !== 'currentUser' && message.status !== 'read'
              ? { ...message, status: 'read' }
              : message
          ),
          chats: state.chats.map(chat => 
            chat.id === chatId 
              ? { ...chat, unreadCount: 0 }
              : chat
          )
        }));
      },
      
      markAsRead: (chatId: string) => {
        set(state => ({
          messages: state.messages.map(message => 
            message.chatId === chatId && message.senderId !== 'currentUser'
              ? { ...message, status: 'read' }
              : message
          ),
          chats: state.chats.map(chat => 
            chat.id === chatId 
              ? { ...chat, unreadCount: 0 }
              : chat
          )
        }));
      }
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);