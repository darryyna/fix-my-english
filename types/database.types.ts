export type EnglishLevel = 'B1' | 'B1+' | 'B2' | 'B2+' | 'C1';

export type LearningGoal = 'general' | 'travel' | 'business' | 'custom';

export type FocusArea = 'grammar' | 'vocabulary';

export interface WeakTopic {
  topic: string;
  // 1-100
  progress: number;
}

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
  daily_goal_minutes: number | null;

  grammar_progress: number;
  vocabulary_progress: number;
  learned_words_count: number;
  weak_topics: WeakTopic[];

  assessment_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
    };
  };
}
