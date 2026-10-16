"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, LocaleInput } from "@fullcalendar/core/index.js";
import { useShift } from "@/hooks/useShift";
import { toCalendarEvents } from "@/utils/eventFilter";
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
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function MonthPanel({
  date,
  width,
  KoLocal,
  onEventClick,
}: MonthPanelProps) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = formatDate(new Date(year, month, 1));
  const endDate = formatDate(new Date(year, month + 1, 1));

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
    <div style={{ width, flexShrink: 0 }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={date}
        events={calendarEvents}
        height="100%"
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
