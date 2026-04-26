import { create } from "zustand";

type DateState = {
  currentDate: string;
  updateCurrentDate: (date: string) => void;
};

const useDateStore = create<DateState>((set) => ({
  currentDate: "",
  updateCurrentDate: (currentDate) => set(() => ({ currentDate: currentDate })),
}));

export default useDateStore;
