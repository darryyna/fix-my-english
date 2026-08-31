export type EnglishLevel = 'B1' | 'B1+' | 'B2' | 'B2+' | 'C1';

export type LearningGoal =
    | 'GENERAL_ENGLISH'
    | 'TRAVEL'
    | 'BUSINESS_ENGLISH'
    | 'CUSTOM';

export type LearningFocus = 'GRAMMAR' | 'VOCABULARY';

export type DailyGoalMinutes = 5 | 10 | 15 | 20 | 30;

export interface LearningPreferences {
    englishLevel: EnglishLevel;
    goal: LearningGoal;
    customGoal: string | null;
    focus: LearningFocus[];
    dailyGoalMinutes: DailyGoalMinutes;
}