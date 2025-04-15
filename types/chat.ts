export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  image?: string;
  audio?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}