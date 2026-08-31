export type EnglishLevel = 'B1' | 'B1+' | 'B2' | 'B2+' | 'C1';

export type LearningGoal = 'general' | 'travel' | 'business' | 'custom';

export type FocusArea = 'grammar' | 'vocabulary';

export type DailyGoalMinutes = 5 | 10 | 15 | 20 | 30;

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;

  current_level: EnglishLevel | null;
  target_level: EnglishLevel | null;

  goal: LearningGoal | null;
  custom_goal_topic: string | null;
  focus: FocusArea[] | null;
  daily_goal_minutes: DailyGoalMinutes | null;

  learned_words_count: number;
  assessment_completed: boolean;

  created_at: string;
  updated_at: string;
}

export interface AssessmentRow {
    id: string;
    user_id: string;
    suggested_level: EnglishLevel;
    grammar_score: number;
    vocabulary_score: number;
    completed_at: string;
    created_at: string;
}

export interface AssessmentWeakTopicRow {
    id: string;
    assessment_id: string;
    category: FocusArea;
    topic: string;
    score: number;
    created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };

      assessments: {
        Row: AssessmentRow;
        Insert: Omit<
          AssessmentRow,
          'id' | 'created_at'
        >;
        Update: never;
      };

      assessment_weak_topics: {
        Row: AssessmentWeakTopicRow;
        Insert: Omit<AssessmentWeakTopicRow, 'id'>;
        Update: never;
      };
    };
  };
}