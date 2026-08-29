import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/theme';

// Keep the native splash (your local asset, configured in app.json) visible
// until we know whether there's an active Supabase session.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
          <Stack.Screen name="assessment" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
