import React, { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { colors } from "@/constants/colors";
import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const isRedirectingRef = useRef(false);
  
  // Handle authentication redirects
  useEffect(() => {
    // Only run this effect once the auth state is initialized
    if (!isInitialized) return;
    
    // If the user is authenticated and we're in the auth section, redirect to tabs
    // Use a ref to prevent multiple redirects
    if (isAuthenticated && segments[0] === '(auth)' && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      
      // Use setTimeout to ensure this happens after layout is mounted
      const redirectTimer = setTimeout(() => {
        router.replace('/(tabs)');
        // Reset the ref after a short delay to allow for future redirects if needed
        setTimeout(() => {
          isRedirectingRef.current = false;
        }, 500);
      }, 0);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isInitialized, segments]);
  
  // If not initialized yet, return a minimal Stack to prevent rendering issues
  if (!isInitialized) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    );
  }
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Log In" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Reset Password" }} />
    </Stack>
  );
}