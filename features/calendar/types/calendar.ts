export type Direction = "left" | "right";

export interface CalendarEvent {
  title: string;
  start: string;
  extendedProps: {
    isChanged: boolean | "" | null;
    originalType: string;
    changedType: string | null;
  };
}
