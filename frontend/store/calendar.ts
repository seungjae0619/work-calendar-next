import { create } from "zustand";

type CalendarState = {
  startDate: string;
  endDate: string;
  currentDate: string;
  displayYear: number;
  displayMonth: number;
  updateDate: (startDate: string, endDate: string) => void;
  updateCurrentDate: (currentDate: string) => void;
  setDisplayDate: (year: number, month: number) => void;
};

const useCalendarStore = create<CalendarState>((set) => ({
  startDate: "",
  endDate: "",
  currentDate: "",
  displayYear: 0,
  displayMonth: 0,
  updateDate: (startDate, endDate) =>
    set(() => ({ startDate: startDate, endDate: endDate })),
  updateCurrentDate: (currentDate) => set(() => ({ currentDate: currentDate })),
  setDisplayDate: (year, month) =>
    set({ displayYear: year, displayMonth: month }),
}));

export default useCalendarStore;
