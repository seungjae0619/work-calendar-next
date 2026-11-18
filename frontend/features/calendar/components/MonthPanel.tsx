"use client";

import { useLayoutEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, LocaleInput } from "@fullcalendar/core/index.js";
import { useShift } from "@/hooks/useShift";
import { toCalendarEvents } from "@/utils/eventFilter";
import { getMonthQueryRange } from "@/utils/dateHelpers";
import {
  getHolidayClassNames,
  renderDayCell,
  renderEventContent,
} from "./CalendarRenderer";
import { ShiftEvent } from "../types/calendar";

interface MonthPanelProps {
  date: Date;
  width: number;
  KoLocal: LocaleInput;
  onEventClick: (event: ShiftEvent) => void;
  onHeightChange: (time: number, height: number) => void;
}

export default function MonthPanel({
  date,
  width,
  KoLocal,
  onEventClick,
  onHeightChange,
}: MonthPanelProps) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const time = date.getTime();
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const report = () => onHeightChange(time, el.offsetHeight);
    report();

    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [time, onHeightChange]);

  const { startDate, endDate } = getMonthQueryRange(date);

  const shift = useShift(startDate, endDate);
  const calendarEvents = toCalendarEvents(shift, year, month + 1);

  const handleEventClick = (eventInfo: EventClickArg) => {
    const shiftData = shift.find((s) => s.date === eventInfo.event.startStr);
    onEventClick({
      work_type: shiftData?.work_type || "",
      date: eventInfo.event.startStr,
      changed_work_type: shiftData?.changed_work_type || null,
    });
  };

  return (
    <div ref={panelRef} style={{ width, flexShrink: 0 }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={date}
        events={calendarEvents}
        contentHeight="auto"
        locale={KoLocal}
        fixedWeekCount={false}
        headerToolbar={false}
        eventContent={renderEventContent}
        dayCellContent={renderDayCell}
        eventClick={handleEventClick}
        dayCellClassNames={getHolidayClassNames}
      />
    </div>
  );
}
