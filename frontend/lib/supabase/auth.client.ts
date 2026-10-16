import { supabase } from "@/lib/supabase/client";

export const authClientService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },
};
