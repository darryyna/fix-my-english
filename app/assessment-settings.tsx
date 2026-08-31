import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { colors, radii, spacing, typography } from '@/constants/theme.constants';
import { saveAssessment } from '@/lib/assessment.lib';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';
import type {
  AssessmentResult,
} from '@/types/assessment.types';
import type {
  DailyGoalMinutes,
  EnglishLevel,
  FocusArea,
  LearningGoal,
} from '@/types/database.types';

const ENGLISH_LEVELS: EnglishLevel[] = [
  'B1',
  'B1+',
  'B2',
  'B2+',
  'C1',
];

const GOALS: {
  value: LearningGoal;
  label: string;
}[] = [
  {
    value: 'general',
    label: 'General English',
  },
  {
    value: 'travel',
    label: 'Travel',
  },
  {
    value: 'business',
    label: 'Formal / Business English',
  },
  {
    value: 'custom',
    label: 'Custom topic',
  },
];

const FOCUS_AREAS: {
  value: FocusArea;
  label: string;
}[] = [
  {
    value: 'grammar',
    label: 'Grammar',
  },
  {
    value: 'vocabulary',
    label: 'Vocabulary',
  },
];

const DAILY_GOALS: DailyGoalMinutes[] = [
  5,
  10,
  15,
  20,
  30,
];

export default function AssessmentSettingsScreen() {
  const { result } = useLocalSearchParams<{
    result?: string;
  }>();

  const session = useAuthStore(
    (state) => state.session,
  );

  const fetchProfile = useProfileStore(
    (state) => state.fetchProfile,
  );

  const assessmentResult = useMemo<AssessmentResult | null>(
    () => parseAssessmentResult(result),
    [result],
  );

  const [level, setLevel] = useState<EnglishLevel>(
    assessmentResult?.suggestedLevel ?? 'B1',
  );

  const [goal, setGoal] =
    useState<LearningGoal>('general');

  const [focus, setFocus] = useState<FocusArea[]>([
    'grammar',
    'vocabulary',
  ]);

  const [dailyGoal, setDailyGoal] =
    useState<DailyGoalMinutes>(15);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFocus = (value: FocusArea) => {
    setFocus((currentFocus) => {
      if (currentFocus.includes(value)) {
        return currentFocus.filter(
          (item) => item !== value,
        );
      }

      return [...currentFocus, value];
    });
  };

  const handleContinue = async () => {
    if (
      !session?.user.id ||
      !assessmentResult ||
      focus.length === 0
    ) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveAssessment(
        session.user.id,
        assessmentResult,
        level,
        goal,
        focus,
        dailyGoal,
      );

      await fetchProfile(session.user.id);

      router.replace('/(tabs)');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save your assessment.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!assessmentResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={typography.h2}>
            Something went wrong
          </Text>

          <Text style={typography.bodySecondary}>
            We could not load your assessment result.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            ONE LAST STEP
          </Text>

          <Text style={typography.h1}>
            Set your learning goals
          </Text>

          <Text style={styles.subtitle}>
            We suggested {assessmentResult.suggestedLevel}{' '}
            based on your assessment. You can change it
            if you prefer.
          </Text>
        </View>

        <Card style={styles.card}>
          <Text
            style={[
              typography.h2,
              styles.cardTitle,
            ]}
          >
            English level
          </Text>

          <View style={styles.options}>
            {ENGLISH_LEVELS.map((item) => (
              <OptionButton
                key={item}
                label={item}
                selected={level === item}
                onPress={() => setLevel(item)}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text
            style={[
              typography.h2,
              styles.cardTitle,
            ]}
          >
            Goal
          </Text>

          <View style={styles.options}>
            {GOALS.map((item) => (
              <OptionButton
                key={item.value}
                label={item.label}
                selected={goal === item.value}
                onPress={() => setGoal(item.value)}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text
            style={[
              typography.h2,
              styles.cardTitle,
            ]}
          >
            Focus
          </Text>

          <Text
            style={[
              typography.bodySecondary,
              styles.description,
            ]}
          >
            Choose one or both areas.
          </Text>

          <View style={styles.options}>
            {FOCUS_AREAS.map((item) => (
              <OptionButton
                key={item.value}
                label={item.label}
                selected={focus.includes(item.value)}
                onPress={() =>
                  toggleFocus(item.value)
                }
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text
            style={[
              typography.h2,
              styles.cardTitle,
            ]}
          >
            Daily learning goal
          </Text>

          <View style={styles.options}>
            {DAILY_GOALS.map((item) => (
              <OptionButton
                key={item}
                label={`${item} min`}
                selected={dailyGoal === item}
                onPress={() => setDailyGoal(item)}
              />
            ))}
          </View>
        </Card>

        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        <Pressable
          disabled={
            focus.length === 0 || isSaving
          }
          onPress={handleContinue}
          style={[
            styles.button,
            (focus.length === 0 || isSaving) &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Saving...' : 'Get started'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function parseAssessmentResult(
  value?: string,
): AssessmentResult | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!isAssessmentResult(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function isAssessmentResult(
  value: unknown,
): value is AssessmentResult {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    typeof result.suggestedLevel === 'string' &&
    typeof result.grammarScore === 'number' &&
    typeof result.vocabularyScore === 'number' &&
    Array.isArray(result.weakTopics)
  );
}

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function OptionButton({
  label,
  selected,
  onPress,
}: OptionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        selected && styles.selectedOption,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.selectedOptionText,
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.radio,
          selected && styles.selectedRadio,
        ]}
      >
        {selected && (
          <View style={styles.radioInner} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  header: {
    marginTop: spacing.md,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },

  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },

  card: {
    marginTop: spacing.md,
  },

  cardTitle: {
    marginBottom: spacing.sm,
  },

  description: {
    marginBottom: spacing.md,
  },

  options: {
    gap: spacing.sm,
  },

  option: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },

  optionText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  selectedOptionText: {
    color: colors.text,
    fontWeight: '600',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedRadio: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  button: {
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    ...typography.bodySecondary,
    color: colors.warning,
    textAlign: 'center',
    marginTop: spacing.md,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
});