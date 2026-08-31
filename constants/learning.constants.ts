import type {
    DailyGoalMinutes,
    EnglishLevel,
    LearningFocus,
    LearningGoal,
} from '@/types/learningPreferences.types';

export const ENGLISH_LEVELS: EnglishLevel[] = [
    'B1',
    'B1+',
    'B2',
    'B2+',
    'C1',
];

export const LEARNING_GOALS: LearningGoal[] = [
    'GENERAL_ENGLISH',
    'TRAVEL',
    'BUSINESS_ENGLISH',
    'CUSTOM',
];

export const LEARNING_FOCUS: LearningFocus[] = [
    'GRAMMAR',
    'VOCABULARY',
];

export const DAILY_GOALS: DailyGoalMinutes[] = [
    5,
    10,
    15,
    20,
    30,
];