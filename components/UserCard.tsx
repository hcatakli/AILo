import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { User } from '@/types/community';

interface UserCardProps {
  user: User;
  onPress: () => void;
  style?: object;
  showOnlineStatus?: boolean;
}

export function UserCard({ user, onPress, style, showOnlineStatus = false }: UserCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        {showOnlineStatus && user.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>
      
      <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
      
      <View style={styles.languageContainer}>
        <Text style={styles.nativeLanguage}>
          {user.nativeLanguage}
        </Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.learningLanguage}>
          {user.learningLanguage}
        </Text>
      </View>
      
      {user.matchPercentage && (
        <View style={styles.matchContainer}>
          <Text style={styles.matchText}>{user.matchPercentage}% Match</Text>
        </View>
      )}
      
      <View style={styles.interestsContainer}>
        {user.interests.slice(0, 2).map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
        {user.interests.length > 2 && (
          <Text style={styles.moreInterests}>+{user.interests.length - 2}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.card,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  nativeLanguage: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 13,
    color: colors.primary,
    marginHorizontal: 4,
  },
  learningLanguage: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  matchContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  interestTag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  interestText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  moreInterests: {
    fontSize: 11,
    color: colors.textSecondary,
    alignSelf: 'center',
  },
});