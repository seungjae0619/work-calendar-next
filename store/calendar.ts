import { create } from "zustand";

type CalendarState = {
  startDate: string;
  endDate: string;
  displayYear: number;
  displayMonth: number;
  updateStartDate: (startDate: string) => void;
  updateEndDate: (endDate: string) => void;
  setDisplayDate: (year: number, month: number) => void;
};

const useCalendarStore = create<CalendarState>((set) => ({
  startDate: "",
  endDate: "",
  displayYear: new Date().getFullYear(),
  displayMonth: new Date().getMonth() + 1,
  updateStartDate: (startDate) => set(() => ({ startDate: startDate })),
  updateEndDate: (endDate) => set(() => ({ endDate: endDate })),
  setDisplayDate: (year, month) =>
    set({ displayYear: year, displayMonth: month }),
}));

export default useCalendarStore;
