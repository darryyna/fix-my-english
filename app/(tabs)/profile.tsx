import { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography, radii } from '@/constants/theme';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AssessmentBanner} from "@/components/ui/AssessmentBanner";

export default function ProfileScreen() {
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);
  const { profile, isLoading, fetchProfile, reset } = useProfileStore();
  const insets = useSafeAreaInsets();

  const load = useCallback(() => {
    if (session?.user.id) fetchProfile(session.user.id);
  }, [session?.user.id, fetchProfile]);

  useEffect(() => {
    load();
  }, [load]);

  const overallProgress =
    profile != null ? Math.round((profile.grammar_progress + profile.vocabulary_progress) / 2) : 0;

  return (
      <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.md }]}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor={colors.primary} />}
      >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.primary} />
        </View>
        <View style={{ marginLeft: spacing.md, flex: 1 }}>
          <Text style={typography.h2}>{profile?.full_name || session?.user.email || 'Profile'}</Text>
          <Text style={typography.bodySecondary}>
            Level {profile?.current_level ?? '—'} → goal {profile?.target_level ?? '—'}
          </Text>
        </View>
      </View>

          {!profile?.assessment_completed && (
              <View style={{ marginTop: spacing.md }}>
                  <AssessmentBanner />
              </View>
          )}
      {/* main info */}
      <Card style={{ marginTop: spacing.lg }}>
        <Text style={[typography.h2, { marginBottom: spacing.md }]}>Progress</Text>
        <ProgressBar label="Grammar" value={profile?.grammar_progress ?? 0} color={colors.grammar} />
        <ProgressBar label="Vocabulary" value={profile?.vocabulary_progress ?? 0} color={colors.vocabulary} />
        <ProgressBar label="Overall" value={overallProgress} color={colors.primary} />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={typography.h2}>{profile?.learned_words_count ?? 0}</Text>
            <Text style={typography.caption}>learned words</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={typography.h2}>{profile?.weak_topics?.length ?? 0}</Text>
            <Text style={typography.caption}>weak topics</Text>
          </View>
        </View>
      </Card>

      {/* Weak topics */}
      <Card style={{ marginTop: spacing.md }}>
        <Text style={[typography.h2, { marginBottom: spacing.md }]}>Weak topics</Text>
        {profile?.weak_topics?.length ? (
          profile.weak_topics.map((topic) => (
            <Pressable key={topic.topic} style={styles.weakTopicRow}>
              <ProgressBar label={topic.topic} value={topic.progress} color={colors.warning} />
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))
        ) : (
          <Text style={typography.bodySecondary}>
            No weak topics. Youre doing great :))
          </Text>
        )}
      </Card>

      {/* Settings summary */}
      <Card style={{ marginTop: spacing.md }}>
        <Text style={[typography.h2, { marginBottom: spacing.sm }]}>Settings</Text>
        <SettingsRow label="Goal" value={goalLabel(profile?.goal, profile?.custom_goal_topic)} />
        <SettingsRow label="Focus" value={(profile?.focus ?? []).join(', ') || '—'} />
        <SettingsRow label="Daily goal" value={profile?.daily_goal_minutes ? `${profile.daily_goal_minutes} min` : '—'} />
      </Card>

      <Button
        title="Logout"
        variant="secondary"
        onPress={async () => {
          reset();
          await signOut();
        }}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

function goalLabel(goal?: string | null, customTopic?: string | null) {
  if (!goal) return '—';
  if (goal === 'custom') return customTopic || 'Custom topic';
  const map: Record<string, string> = {
    general: 'General English',
    travel: 'Travel',
    business: 'Formal / Business English',
  };
  return map[goal] ?? goal;
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingsRow}>
      <Text style={typography.bodySecondary}>{label}</Text>
      <Text style={typography.body}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  weakTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
});
