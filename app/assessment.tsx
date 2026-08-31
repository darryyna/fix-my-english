import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { ASSESSMENT_QUESTIONS } from '@/constants/assessmentQuestions.constants';
import { calculateAssessmentResult } from '@/lib/assessment.lib';
import type { AssessmentAnswer } from '@/types/assessment.types';

export default function AssessmentScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);

  const currentQuestion =
    ASSESSMENT_QUESTIONS[currentQuestionIndex];

  const selectedAnswer = useMemo(
    () =>
      answers.find(
        (answer) =>
          answer.questionId === currentQuestion.id,
      )?.selectedAnswer,
    [answers, currentQuestion.id],
  );

  const isLastQuestion =
    currentQuestionIndex ===
    ASSESSMENT_QUESTIONS.length - 1;

  const progress =
    (currentQuestionIndex + 1) /
    ASSESSMENT_QUESTIONS.length;

  const handleAnswerSelect = (answer: string) => {
    setAnswers((currentAnswers) => {
      const existingAnswer = currentAnswers.find(
        (item) =>
          item.questionId === currentQuestion.id,
      );

      if (existingAnswer) {
        return currentAnswers.map((item) =>
          item.questionId === currentQuestion.id
            ? {
                ...item,
                selectedAnswer: answer,
              }
            : item,
        );
      }

      return [
        ...currentAnswers,
        {
          questionId: currentQuestion.id,
          selectedAnswer: answer,
        },
      ];
    });
  };

    const handleNext = () => {
        if (!selectedAnswer) {
            return;
        }

        const updatedAnswers = answers.some(
            (answer) =>
                answer.questionId === currentQuestion.id,
        )
            ? answers.map((answer) =>
                answer.questionId === currentQuestion.id
                    ? {
                        ...answer,
                        selectedAnswer,
                    }
                    : answer,
            )
            : [
                ...answers,
                {
                    questionId: currentQuestion.id,
                    selectedAnswer,
                },
            ];

        if (!isLastQuestion) {
            setAnswers(updatedAnswers);
            setCurrentQuestionIndex(
                (currentIndex) => currentIndex + 1,
            );

            return;
        }

        const result = calculateAssessmentResult(
            ASSESSMENT_QUESTIONS,
            updatedAnswers,
        );

        router.push({
            pathname: '/assessment-result',
            params: {
                result: JSON.stringify(result),
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
          <Text style={styles.title}>Assessment</Text>

          <Text style={styles.counter}>
            {currentQuestionIndex + 1} /{' '}
            {ASSESSMENT_QUESTIONS.length}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progress,
              {
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>
            {currentQuestion.category === 'grammar'
              ? 'Grammar'
              : 'Vocabulary'}
          </Text>

          <Text style={styles.topic}>
            {currentQuestion.topic}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            {currentQuestion.question}
          </Text>
        </View>

        <View style={styles.options}>
          {currentQuestion.options.map((option) => {
            const isSelected =
              selectedAnswer === option;

            return (
              <Pressable
                key={option}
                onPress={() =>
                  handleAnswerSelect(option)
                }
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    isSelected && styles.selectedRadio,
                  ]}
                >
                  {isSelected && (
                    <View style={styles.radioInner} />
                  )}
                </View>

                <Text
                  style={[
                    styles.optionText,
                    isSelected &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          disabled={!selectedAnswer}
          onPress={handleNext}
          style={[
            styles.nextButton,
            !selectedAnswer &&
              styles.disabledNextButton,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'Finish' : 'Next'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1115',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },

  counter: {
    color: '#8E929B',
    fontSize: 14,
    fontWeight: '500',
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#292D35',
    marginTop: 20,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  categoryContainer: {
    marginTop: 36,
  },

  category: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  topic: {
    color: '#8E929B',
    fontSize: 14,
    marginTop: 6,
  },

  questionContainer: {
    marginTop: 28,
  },

  question: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },

  options: {
    marginTop: 32,
    gap: 12,
  },

  option: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#292D35',
    backgroundColor: '#171A20',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedOption: {
    borderColor: '#FFFFFF',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#646872',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  selectedRadio: {
    borderColor: '#FFFFFF',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  optionText: {
    flex: 1,
    color: '#D5D7DC',
    fontSize: 16,
    lineHeight: 22,
  },

  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  nextButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },

  disabledNextButton: {
    opacity: 0.35,
  },

  nextButtonText: {
    color: '#0F1115',
    fontSize: 16,
    fontWeight: '700',
  },
});