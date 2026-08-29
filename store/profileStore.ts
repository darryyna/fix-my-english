import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database.types';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    set({ profile: data as Profile, isLoading: false });
  },

  reset: () => set({ profile: null, error: null }),
}));
