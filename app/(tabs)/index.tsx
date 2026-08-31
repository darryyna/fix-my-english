import { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme.constants';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AssessmentBanner} from "@/components/ui/AssessmentBanner";

export default function HomeScreen() {
    const session = useAuthStore((s) => s.session);
    const profile = useProfileStore((s) => s.profile);
    const fetchProfile = useProfileStore((s) => s.fetchProfile);

    // Refetch every time this tab comes into focus (e.g. after finishing
    // the assessment and being redirected back to Home), not only once on
    // mount — otherwise a stale cached profile keeps showing the banner.
    useFocusEffect(
        useCallback(() => {
            if (session?.user.id) fetchProfile(session.user.id);
        }, [session?.user.id, fetchProfile]),
    );

    const insets = useSafeAreaInsets();
    return (
        <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.md }]}
        >
            <Text style={typography.h1}>Hi bitch</Text>
            <Text style={[typography.bodySecondary, { marginTop: spacing.xs, marginBottom: spacing.lg }]}>
                {profile?.daily_goal_minutes
                    ? `Your goal for today — ${profile.daily_goal_minutes} min of practice`
                    : 'Continue studying everyday'}
            </Text>

            {!profile?.assessment_completed && <AssessmentBanner />}

            <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                <Ionicons name="construct-outline" size={32} color={colors.textMuted} />
                <Text style={[typography.body, { marginTop: spacing.sm, textAlign: 'center' }]}>
                    Coming soon: Assessment, Vocabulary cards, Grammar exercises
                </Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { padding: spacing.lg },
});