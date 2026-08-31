import { useMemo } from 'react';
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
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, radii, spacing, typography } from '@/constants/theme.constants';
import type { AssessmentResult } from '@/types/assessment.types';

export default function AssessmentResultScreen() {
  const { result } = useLocalSearchParams<{
    result?: string;
  }>();

  const assessmentResult = useMemo<AssessmentResult | null>(() => {
    if (!result) {
      return null;
    }

    try {
      return JSON.parse(result) as AssessmentResult;
    } catch {
      return null;
    }
  }, [result]);

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

  const {
    suggestedLevel,
    grammarScore,
    vocabularyScore,
    weakTopics,
  } = assessmentResult;

  const overallScore = Math.round(
    (grammarScore + vocabularyScore) / 2,
  );

  const handleContinue = () => {
    router.push({
      pathname: '/assessment-settings',
      params: {
        result: JSON.stringify(assessmentResult),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            ASSESSMENT COMPLETE
          </Text>

          <Text style={typography.h1}>
            Your English level
          </Text>

          <Text style={styles.subtitle}>
            Based on your answers, we estimate your current
            level at:
          </Text>
        </View>

        <View style={styles.levelContainer}>
          <Text style={styles.level}>
            {suggestedLevel}
          </Text>

          <Text style={styles.levelLabel}>
            Suggested level
          </Text>
        </View>

        <Card style={styles.card}>
          <Text
            style={[
              typography.h2,
              styles.cardTitle,
            ]}
          >
            Your results
          </Text>

          <ProgressBar
            label="Grammar"
            value={grammarScore}
            color={colors.grammar}
          />

          <ProgressBar
            label="Vocabulary"
            value={vocabularyScore}
            color={colors.vocabulary}
          />

          <ProgressBar
            label="Overall"
            value={overallScore}
            color={colors.primary}
          />
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
            <View style={styles.topics}>
              {weakTopics.map((topic) => (
                <View
                  key={`${topic.category}-${topic.topic}`}
                  style={styles.topic}
                >
                  <View style={styles.topicHeader}>
                    <Text style={typography.body}>
                      {topic.topic}
                    </Text>

                    <Text
                      style={styles.topicScore}
                    >
                      {topic.score}%
                    </Text>
                  </View>

                  <ProgressBar
                    label=""
                    value={topic.score}
                    color={colors.warning}
                  />

                  <Text style={typography.caption}>
                    {topic.category === 'grammar'
                      ? 'Grammar'
                      : 'Vocabulary'}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={typography.bodySecondary}>
              No weak topics found. Great job!
            </Text>
          )}
        </Card>

        <View style={styles.bottom}>
          <Text style={styles.bottomText}>
            You can choose a different level before
            starting your learning journey.
          </Text>

          <Pressable
            onPress={handleContinue}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
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

  levelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },

  level: {
    color: colors.primary,
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '800',
  },

  levelLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },

  card: {
    marginTop: spacing.md,
  },

  cardTitle: {
    marginBottom: spacing.md,
  },

  topics: {
    gap: spacing.lg,
  },

  topic: {
    gap: spacing.xs,
  },

  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topicScore: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  bottom: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },

  bottomText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },

  button: {
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
});