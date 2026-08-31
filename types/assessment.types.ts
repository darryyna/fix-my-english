import type { EnglishLevel, FocusArea } from './database.types';

export interface AssessmentQuestion {
    id: string;
    category: FocusArea;
    topic: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface AssessmentAnswer {
    questionId: string;
    selectedAnswer: string;
}

export interface AssessmentTopicResult {
    category: FocusArea;
    topic: string;
    score: number;
}

export interface AssessmentResult {
    suggestedLevel: EnglishLevel;
    grammarScore: number;
    vocabularyScore: number;
    weakTopics: AssessmentTopicResult[];
}

export interface AssessmentSummary {
    id: string;
    suggestedLevel: EnglishLevel;
    grammarScore: number;
    vocabularyScore: number;
    completedAt: string;
}