"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import KoLocal from "@fullcalendar/core/locales/ko";
import { useRef } from "react";
import { isHoliday } from "@hyunbinseo/holidays-kr";
import CalendarStyles from "./components/CalendarStyles";
import CalendarDialog from "../dialog/Dialog";
import CalendarDatePicker from "./components/CalendarDatePicker";
import { User } from "@supabase/supabase-js";
import {
  renderDayCell,
  renderEventContent,
} from "./components/CalendarRenderer";
import {
  useCalendarDate,
  useDialogEvent,
  useNavigateMonth,
} from "@/features/calendar/hooks/useCalendarLogic";
import { DayCellContentArg } from "@fullcalendar/core/index.js";

interface Props {
  isLoggedIn: User | null;
  isLoading: boolean;
}

export default function Calendar({ isLoggedIn, isLoading }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const {
    dialogOpen,
    selected,
    selectedEvent,
    displayYear,
    displayMonth,

    setDialogOpen,
    setSelected,

    handleEventClick,
    handleDatesSet,
  } = useCalendarDate(isLoggedIn);

  const {
    slideDirection,
    calendarEvents,
    navigateMonth,
    handleTouchStart,
    handleTouchEnd,
  } = useNavigateMonth(calendarRef);

  const { handleDatePickerSelect } = useDialogEvent(calendarRef);

  const getHolidayClassNames = (arg: DayCellContentArg) => {
    try {
      const year = arg.date.getFullYear();
      const month = String(arg.date.getMonth() + 1).padStart(2, "0");
      const day = String(arg.date.getDate()).padStart(2, "0");
      const kstDate = new Date(`${year}-${month}-${day}T00:00:00+09:00`);
      return isHoliday(kstDate) ? ["fc-day-holiday"] : [];
    } catch {
      return [];
    }
  };

  return (
    <>
      <CalendarStyles />
      <div
        className={`w-full h-full md:h-[480px] md:w-[800px] md:mx-auto flex flex-col relative 
          ${slideDirection === "left" ? "fc-slide-left" : ""}
          ${slideDirection === "right" ? "fc-slide-right" : ""}
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-lg">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-gray-400 hover:text-gray-700 text-xl px-2"
            onClick={() => navigateMonth("right")}
          >
            ‹
          </button>
          <CalendarDatePicker
            year={displayYear}
            month={displayMonth}
            onSelect={handleDatePickerSelect}
          />
          <div className="flex items-center gap-1">
            <button
              className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors"
              onClick={() => {
                calendarRef.current?.getApi().today();
              }}
            >
              오늘
            </button>
            <button
              className="text-gray-400 hover:text-gray-700 text-xl px-2"
              onClick={() => navigateMonth("left")}
            >
              ›
            </button>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height="100%"
          contentHeight="auto"
          locale={KoLocal}
          fixedWeekCount={false}
          ref={calendarRef}
          headerToolbar={false}
          eventContent={renderEventContent}
          dayCellContent={renderDayCell}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          dayCellClassNames={getHolidayClassNames}
        />
        <CalendarDialog
          open={dialogOpen}
          selected={selected}
          selectedEvent={selectedEvent}
          onOpenChange={setDialogOpen}
          setSelected={setSelected}
        />
      </div>
    </>
  );
}
