import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [appIsReady, setAppIsReady] = useState(false);
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        // Only initialize auth if it hasn't been initialized yet
        if (!isInitialized) {
          await initializeAuth();
        }
      } catch (e) {
        console.warn("Error initializing app:", e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [isInitialized]);

  useEffect(() => {
    if (loaded && appIsReady) {
      // Hide the splash screen after everything is ready
      SplashScreen.hideAsync();
    }
  }, [loaded, appIsReady]);

  // Always render the Slot to avoid the navigation error
  // But conditionally render its content
  if (!loaded || !appIsReady) {
    return (
      <View style={styles.container}>
        <Slot />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Slot />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});