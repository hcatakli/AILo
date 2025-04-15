import React, { useEffect, useRef } from 'react';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { Home, ListPlus, BookOpen, Users, Settings, Mic, Brain } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const isRedirectingRef = useRef(false);
  
  // Handle authentication redirects
  useEffect(() => {
    // Only run this effect once the auth state is initialized
    if (!isInitialized) return;
    
    // If the user is not authenticated and we're in the tabs section, redirect to auth
    // Use a ref to prevent multiple redirects
    if (!isAuthenticated && segments[0] === '(tabs)' && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      
      // Use setTimeout to ensure this happens after layout is mounted
      const redirectTimer = setTimeout(() => {
        router.replace('/(auth)');
        // Reset the ref after a short delay to allow for future redirects if needed
        setTimeout(() => {
          isRedirectingRef.current = false;
        }, 500);
      }, 0);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isInitialized, segments]);
  
  // If not initialized yet, return null to prevent rendering the tabs
  // This helps prevent the infinite loop by not rendering until auth is ready
  if (!isInitialized) {
    return null;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: 'My Lists',
          tabBarIcon: ({ color, size }) => (
            <ListPlus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Mic size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color, size }) => (
            <Brain size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}