import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentBanner } from '@/components/ui/AssessmentBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, radii, spacing, typography } from '@/constants/theme.constants';
import { fetchLatestAssessment } from '@/lib/assessment.lib';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';
import type {
  AssessmentSummary,
  AssessmentTopicResult,
} from '@/types/assessment.types';

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  const {
    profile,
    isLoading,
    fetchProfile,
    reset,
  } = useProfileStore();

  const insets = useSafeAreaInsets();

  const [assessment, setAssessment] =
    useState<AssessmentSummary | null>(null);

  const [weakTopics, setWeakTopics] =
    useState<AssessmentTopicResult[]>([]);

  const [isAssessmentLoading, setIsAssessmentLoading] =
    useState(false);

  const loadProfile = useCallback(() => {
    if (!session?.user.id) {
      return;
    }

    fetchProfile(session.user.id);
  }, [session?.user.id, fetchProfile]);

  const loadAssessment = useCallback(async () => {
    if (!session?.user.id) {
      return;
    }

    setIsAssessmentLoading(true);

    try {
      const result = await fetchLatestAssessment(
        session.user.id,
      );

      setAssessment(result.assessment);
      setWeakTopics(result.weakTopics);
    } finally {
      setIsAssessmentLoading(false);
    }
  }, [session?.user.id]);

  const refresh = useCallback(async () => {
    loadProfile();
    await loadAssessment();
  }, [loadProfile, loadAssessment]);

  useEffect(() => {
    loadProfile();
    loadAssessment();
  }, [loadProfile, loadAssessment]);

  const overallProgress = assessment
    ? Math.round(
        (assessment.grammarScore +
          assessment.vocabularyScore) /
          2,
      )
    : 0;

  const isLoadingData =
    isLoading || isAssessmentLoading;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop:
            insets.top + spacing.md,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingData}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={28}
            color={colors.primary}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={typography.h2}>
            {profile?.full_name ||
              session?.user.email ||
              'Profile'}
          </Text>

          <Text style={typography.bodySecondary}>
            Level {profile?.current_level ?? '—'} → target{' '}
            {profile?.target_level ?? '—'}
          </Text>
        </View>
      </View>

      {!assessment && (
        <View style={styles.assessmentBanner}>
          <AssessmentBanner />
        </View>
      )}

      <Card style={styles.progressCard}>
        <Text
          style={[
            typography.h2,
            styles.cardTitle,
          ]}
        >
          Progress
        </Text>

        {assessment ? (
          <>
            <ProgressBar
              label="Grammar"
              value={assessment.grammarScore}
              color={colors.grammar}
            />

            <ProgressBar
              label="Vocabulary"
              value={assessment.vocabularyScore}
              color={colors.vocabulary}
            />

            <ProgressBar
              label="Overall"
              value={overallProgress}
              color={colors.primary}
            />
          </>
        ) : (
          <Text style={typography.bodySecondary}>
            Complete your assessment to see your
            progress.
          </Text>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={typography.h2}>
              {profile?.learned_words_count ?? 0}
            </Text>

            <Text style={typography.caption}>
              learned words
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={typography.h2}>
              {weakTopics.length}
            </Text>

            <Text style={typography.caption}>
              weak topics
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text
          style={[
            typography.h2,
            styles.cardTitle,
          ]}
        >
          Weak topics
        </Text>

        {weakTopics.length > 0 ? (
          weakTopics.map((topic) => (
            <Pressable
              key={`${topic.category}-${topic.topic}`}
              style={styles.weakTopicRow}
            >
              <View style={styles.weakTopicContent}>
                <ProgressBar
                  label={topic.topic}
                  value={topic.score}
                  color={colors.warning}
                />

                <Text style={typography.caption}>
                  {topic.category === 'grammar'
                    ? 'Grammar'
                    : 'Vocabulary'}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          ))
        ) : (
          <Text style={typography.bodySecondary}>
            {assessment
              ? 'No weak topics. You’re doing great!'
              : 'Complete your assessment to discover your weak topics.'}
          </Text>
        )}
      </Card>

      <Card style={styles.card}>
        <Text
          style={[
            typography.h2,
            styles.settingsTitle,
          ]}
        >
          Settings
        </Text>

        <SettingsRow
          label="Goal"
          value={goalLabel(
            profile?.goal,
            profile?.custom_goal_topic,
          )}
        />

        <SettingsRow
          label="Focus"
          value={
            (profile?.focus ?? []).join(', ') || '—'
          }
        />

        <SettingsRow
          label="Daily goal"
          value={
            profile?.daily_goal_minutes
              ? `${profile.daily_goal_minutes} min`
              : '—'
          }
        />
      </Card>

      <Button
        title="Logout"
        variant="secondary"
        onPress={async () => {
          reset();
          await signOut();
        }}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

function goalLabel(
  goal?: string | null,
  customTopic?: string | null,
): string {
  if (!goal) {
    return '—';
  }

  if (goal === 'custom') {
    return customTopic || 'Custom topic';
  }

  const labels: Record<string, string> = {
    general: 'General English',
    travel: 'Travel',
    business: 'Formal / Business English',
  };

  return labels[goal] ?? goal;
}

function SettingsRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.settingsRow}>
      <Text style={typography.bodySecondary}>
        {label}
      </Text>

      <Text style={styles.settingsValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  assessmentBanner: {
    marginTop: spacing.md,
  },

  progressCard: {
    marginTop: spacing.lg,
  },

  card: {
    marginTop: spacing.md,
  },

  cardTitle: {
    marginBottom: spacing.md,
  },

  settingsTitle: {
    marginBottom: spacing.sm,
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

  weakTopicContent: {
    flex: 1,
  },

  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },

  settingsValue: {
    ...typography.body,
    flexShrink: 1,
    textAlign: 'right',
  },

  logoutButton: {
    marginTop: spacing.lg,
  },
});