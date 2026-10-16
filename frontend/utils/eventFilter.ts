import { CalendarEvent } from "@/features/calendar/types/calendar";
import { Shift } from "@/types/shift";

export const toCalendarEvents = (
  shift: Shift[],
  displayYear: number,
  displayMonth: number,
): CalendarEvent[] => {
  const calendarEvents = shift
    .filter((item) => {
      const itemMonth = item.date.slice(0, 7);
      const currentMonth = `${displayYear}-${String(displayMonth).padStart(2, "0")}`;
      return itemMonth === currentMonth;
    })
    .map((item) => ({
      title: item.changed_work_type || item.work_type,
      start: item.date,
      extendedProps: {
        isChanged:
          item.changed_work_type && item.changed_work_type !== item.work_type,
        originalType: item.work_type,
        changedType: item.changed_work_type,
      },
    }));

  return calendarEvents;
};
