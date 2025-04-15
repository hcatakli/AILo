import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, Image as ImageIcon, Paperclip, ChevronLeft, MoreVertical, Phone, Video } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useChatStore } from '@/store/chat-store';
import { useCommunityStore } from '@/store/community-store';
import { Message } from '@/types/chat';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const { messages, sendMessage, loadMessages } = useChatStore();
  const { getUserById } = useCommunityStore();
  
  const partner = getUserById(id as string);
  
  useEffect(() => {
    if (id) {
      loadMessages(id as string);
    }
  }, [id]);
  
  const handleSend = () => {
    if (message.trim()) {
      sendMessage({
        id: Date.now().toString(),
        chatId: id as string,
        senderId: 'currentUser', // Replace with actual user ID
        text: message,
        timestamp: new Date().toISOString(),
        status: 'sent',
      });
      setMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'currentUser';
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
      ]}>
        {!isCurrentUser && (
          <Image source={{ uri: partner?.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentMessageBubble : styles.receivedMessageBubble
        ]}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.messageImage} />
          )}
          {item.audio && (
            <View style={styles.audioContainer}>
              <Mic size={16} color={isCurrentUser ? colors.white : colors.primary} />
              <View style={styles.audioWaveform}>
                {/* Audio waveform visualization would go here */}
                <View style={styles.audioWave} />
              </View>
              <Text style={[
                styles.audioDuration,
                isCurrentUser ? styles.sentAudioDuration : styles.receivedAudioDuration
              ]}>0:32</Text>
            </View>
          )}
          {item.text && (
            <Text style={[
              styles.messageText,
              isCurrentUser ? styles.sentMessageText : styles.receivedMessageText
            ]}>{item.text}</Text>
          )}
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.sentMessageTime : styles.receivedMessageTime
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isCurrentUser && (
              <Text> • {item.status === 'read' ? 'Read' : 'Sent'}</Text>
            )}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.dateLine} />
    </View>
  );
  
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <TouchableOpacity 
              style={styles.headerTitle}
              onPress={() => router.push(`/community/profile/${id}`)}
            >
              <Image source={{ uri: partner?.avatar }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>{partner?.name}</Text>
                <Text style={styles.headerStatus}>
                  {partner?.isOnline ? 'Online' : 'Last seen recently'}
                </Text>
              </View>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Phone size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Video size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MoreVertical size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages.filter(msg => msg.chatId === id)}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          ListHeaderComponent={() => renderDateSeparator('Today')}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.mediaButton}>
              <ImageIcon size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {message.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={22} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.sendButton, isRecording && styles.recordingButton]} 
              onPress={handleRecordToggle}
            >
              <Mic size={22} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginRight: 16,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginHorizontal: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    paddingBottom: 8,
  },
  sentMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  receivedMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  sentMessageText: {
    color: colors.white,
  },
  receivedMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  sentMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedMessageTime: {
    color: colors.textSecondary,
  },
  messageImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 6,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  audioWaveform: {
    flex: 1,
    height: 24,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  audioWave: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  audioDuration: {
    fontSize: 12,
  },
  sentAudioDuration: {
    color: colors.white,
  },
  receivedAudioDuration: {
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  attachButton: {
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  mediaButton: {
    padding: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#E53935',
  },
});