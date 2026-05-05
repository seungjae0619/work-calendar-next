import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | null;
  updateUser: (user: User | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  updateUser: (user) =>
    set(() => ({
      user: user,
    })),
}));

export default useUserStore;
