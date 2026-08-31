import type {
    AssessmentAnswer,
    AssessmentQuestion,
    AssessmentResult,
    AssessmentSummary,
    AssessmentTopicResult,
} from '@/types/assessment.types';
import { supabase } from '@/lib/supabase';
import type {
    EnglishLevel,
    FocusArea,
    LearningGoal,
    DailyGoalMinutes,
} from '@/types/database.types';

function calculateScore(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
): number {
    if (questions.length === 0) {
        return 0;
    }

    const correctAnswers = questions.filter((question) => {
        const answer = answers.find(
            (item) => item.questionId === question.id,
        );

        return answer?.selectedAnswer === question.correctAnswer;
    }).length;

    return Math.round(
        (correctAnswers / questions.length) * 100,
    );
}

function calculateTopicResults(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
): AssessmentTopicResult[] {
    const topics = new Map<string, AssessmentQuestion[]>();

    for (const question of questions) {
        const topicQuestions =
            topics.get(question.topic) ?? [];

        topics.set(question.topic, [
            ...topicQuestions,
            question,
        ]);
    }

    return Array.from(topics.entries()).map(
        ([topic, topicQuestions]) => ({
            category: topicQuestions[0].category,
            topic,
            score: calculateScore(
                topicQuestions,
                answers,
            ),
        }),
    );
}

function calculateSuggestedLevel(
    grammarScore: number,
    vocabularyScore: number,
): EnglishLevel {
    const overallScore =
        (grammarScore + vocabularyScore) / 2;

    if (overallScore < 40) {
        return 'B1';
    }

    if (overallScore < 55) {
        return 'B1+';
    }

    if (overallScore < 70) {
        return 'B2';
    }

    if (overallScore < 85) {
        return 'B2+';
    }

    return 'C1';
}

export function calculateAssessmentResult(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
): AssessmentResult {
    const grammarQuestions = questions.filter(
        (question) =>
            question.category === 'grammar',
    );

    const vocabularyQuestions = questions.filter(
        (question) =>
            question.category === 'vocabulary',
    );

    const grammarScore = calculateScore(
        grammarQuestions,
        answers,
    );

    const vocabularyScore = calculateScore(
        vocabularyQuestions,
        answers,
    );

    const weakTopics = calculateTopicResults(
        questions,
        answers,
    )
        .filter((result) => result.score < 60)
        .sort(
            (first, second) =>
                first.score - second.score,
        );

    return {
        suggestedLevel: calculateSuggestedLevel(
            grammarScore,
            vocabularyScore,
        ),
        grammarScore,
        vocabularyScore,
        weakTopics,
    };
}

export async function saveAssessment(
    userId: string,
    result: AssessmentResult,
    level: EnglishLevel,
    goal: LearningGoal,
    focus: FocusArea[],
    dailyGoal: DailyGoalMinutes,
): Promise<void> {
    const { data: assessment, error: assessmentError } =
        await supabase
            .from('assessments')
            .insert({
                user_id: userId,
                suggested_level:
                    result.suggestedLevel,
                grammar_score: result.grammarScore,
                vocabulary_score:
                    result.vocabularyScore,
                completed_at:
                    new Date().toISOString(),
            })
            .select('id')
            .single();

    if (assessmentError) {
        throw assessmentError;
    }

    if (result.weakTopics.length > 0) {
        const { error: topicsError } =
            await supabase
                .from('assessment_weak_topics')
                .insert(
                    result.weakTopics.map((topic) => ({
                        assessment_id:
                            assessment.id,
                        category: topic.category,
                        topic: topic.topic,
                        score: topic.score,
                    })),
                );

        if (topicsError) {
            throw topicsError;
        }
    }

    const { error: profileError } =
        await supabase
            .from('profiles')
            .update({
                current_level: level,
                goal,
                focus,
                daily_goal_minutes: dailyGoal,
                assessment_completed: true,
                updated_at:
                    new Date().toISOString(),
            })
            .eq('id', userId);

    if (profileError) {
        throw profileError;
    }
}

export async function fetchLatestAssessment(
    userId: string,
): Promise<{
    assessment: AssessmentSummary | null;
    weakTopics: AssessmentTopicResult[];
}> {
    const {
        data: assessment,
        error: assessmentError,
    } = await supabase
        .from('assessments')
        .select(
            'id, suggested_level, grammar_score, vocabulary_score, completed_at',
        )
        .eq('user_id', userId)
        .order('completed_at', {
            ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (assessmentError) {
        throw assessmentError;
    }

    if (!assessment) {
        return {
            assessment: null,
            weakTopics: [],
        };
    }

    const {
        data: topics,
        error: topicsError,
    } = await supabase
        .from('assessment_weak_topics')
        .select('category, topic, score')
        .eq('assessment_id', assessment.id)
        .order('score', {
            ascending: true,
        });

    if (topicsError) {
        throw topicsError;
    }

    return {
        assessment: {
            id: assessment.id,
            suggestedLevel:
                assessment.suggested_level,
            grammarScore:
                assessment.grammar_score,
            vocabularyScore:
                assessment.vocabulary_score,
            completedAt:
                assessment.completed_at,
        },
        weakTopics:
            topics?.map((topic) => ({
                category: topic.category,
                topic: topic.topic,
                score: topic.score,
            })) ?? [],
    };
}