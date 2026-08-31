import {useEffect} from 'react';
import {router, Stack, useSegments} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';

import {colors} from '@/constants/theme.constants';
import {useAuthStore} from '@/store/auth.store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const initialize = useAuthStore((state) => state.initialize);
    const session = useAuthStore((state) => state.session);
    const isLoading = useAuthStore((state) => state.isLoading);

    const segments = useSegments();

    useEffect(() => {
        return initialize();
    }, [initialize]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        SplashScreen.hideAsync().catch(() => {});
    }, [isLoading]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        const firstSegment = segments[0];

        const isAuthRoute = firstSegment === '(auth)';
        const isAuthenticated = session !== null;

        if (!isAuthenticated && !isAuthRoute) {
            router.replace('/(auth)/login');
            return;
        }

        if (isAuthenticated && isAuthRoute) {
            router.replace('/(tabs)');
        }
    }, [isLoading, session, segments]);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <StatusBar style="light" />

            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="assessment"
                    options={{ presentation: 'modal' }}
                />
            </Stack>
        </>
    );
}