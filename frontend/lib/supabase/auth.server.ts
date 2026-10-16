import { createClient } from "@/lib/supabase/server";

export const authServerService = {
  getUser: async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { user };
  },
};
