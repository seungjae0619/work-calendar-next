export type Direction = "left" | "right";

export interface ShiftEvent {
  work_type: string;
  date: string;
  changed_work_type: string | null;
}

export interface CalendarEvent {
  title: string;
  start: string;
  extendedProps: {
    isChanged: boolean | "" | null;
    originalType: string;
    changedType: string | null;
  };
}
