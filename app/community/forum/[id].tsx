import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Heart, Share2, Flag, MoreVertical, Send, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useCommunityStore } from '@/store/community-store';

export default function ForumTopicScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [reply, setReply] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { getForumTopicById, addReplyToTopic, toggleLikeTopic } = useCommunityStore();
  const topic = getForumTopicById(id as string);
  
  if (!topic) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Topic not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="primary"
          style={styles.notFoundButton}
        />
      </View>
    );
  }
  
  const handleReply = () => {
    if (reply.trim()) {
      addReplyToTopic(id as string, reply);
      setReply('');
      
      // Scroll to bottom after adding reply
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Forum Topic',
          headerRight: () => (
            <TouchableOpacity>
              <MoreVertical size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topicContainer}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            
            <View style={styles.topicMeta}>
              <Image source={{ uri: topic.authorAvatar }} style={styles.authorAvatar} />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{topic.author}</Text>
                <Text style={styles.topicTime}>{topic.timeAgo}</Text>
              </View>
              <View style={styles.topicLanguage}>
                <Text style={styles.languageText}>{topic.language}</Text>
              </View>
            </View>
            
            <Text style={styles.topicContent}>{topic.content}</Text>
            
            <View style={styles.topicActions}>
              <TouchableOpacity 
                style={[styles.actionButton, topic.isLiked && styles.likedButton]}
                onPress={() => toggleLikeTopic(id as string)}
              >
                <Heart 
                  size={18} 
                  color={topic.isLiked ? colors.white : colors.textSecondary} 
                />
                <Text style={[
                  styles.actionText,
                  topic.isLiked && styles.likedText
                ]}>
                  {topic.likes}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={18} color={colors.textSecondary} />
                <Text style={styles.actionText}>{topic.replies.length}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Flag size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.repliesContainer}>
            <Text style={styles.repliesTitle}>
              Replies ({topic.replies.length})
            </Text>
            
            {topic.replies.map((reply, index) => (
              <View key={index} style={styles.replyItem}>
                <View style={styles.replyHeader}>
                  <Image source={{ uri: reply.authorAvatar }} style={styles.replyAvatar} />
                  <View style={styles.replyMeta}>
                    <Text style={styles.replyAuthor}>{reply.author}</Text>
                    <Text style={styles.replyTime}>{reply.timeAgo}</Text>
                  </View>
                </View>
                
                <Text style={styles.replyContent}>{reply.content}</Text>
                
                <View style={styles.replyActions}>
                  <TouchableOpacity style={styles.replyAction}>
                    <ThumbsUp size={16} color={colors.textSecondary} />
                    <Text style={styles.replyActionText}>{reply.likes}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.replyAction}>
                    <ThumbsDown size={16} color={colors.textSecondary} />
                    <Text style={styles.replyActionText}>{reply.dislikes}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.replyAction}>
                    <MessageCircle size={16} color={colors.textSecondary} />
                    <Text style={styles.replyActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            {topic.replies.length === 0 && (
              <Text style={styles.noReplies}>
                No replies yet. Be the first to reply!
              </Text>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            placeholderTextColor={colors.textSecondary}
            value={reply}
            onChangeText={setReply}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !reply.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleReply}
            disabled={!reply.trim()}
          >
            <Send size={20} color={colors.white} />
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  topicContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  topicTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  topicLanguage: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  topicContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  topicActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  likedButton: {
    backgroundColor: colors.primary,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  likedText: {
    color: colors.white,
  },
  repliesContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for reply input
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  replyItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  replyHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  replyMeta: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  replyTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  replyContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  replyActions: {
    flexDirection: 'row',
  },
  replyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  replyActionText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  noReplies: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  replyInputContainer: {
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
  replyInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
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