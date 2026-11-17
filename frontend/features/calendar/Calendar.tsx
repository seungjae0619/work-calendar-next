"use client";

import KoLocal from "@fullcalendar/core/locales/ko";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useMonthCarousel } from "./hooks/useCalendarLogic";
import { isHoliday } from "@hyunbinseo/holidays-kr";
import CalendarHeader from "./components/CalendarHeader";
import ShiftCalendar from "./components/ShiftCalendar";
import useUserStore from "@/store/user";
import { useShift } from "@/hooks/useShift";
import { toCalendarEvents } from "@/utils/eventFilter";
import { getMonthQueryRange } from "@/utils/dateHelpers";
import { CalendarEvent } from "./types/calendar";

interface Props {
  user: User | null;
  isLoading: boolean;
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-lg">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};

const getTotalSubstituteHolidays = (calendarEvents: CalendarEvent[]) => {
  let substituteHolidayCount = 0;

  calendarEvents.forEach((item) => {
    const date = new Date(item.start);

    // kr-holidays 라이브러리가 2027년 공휴일이 아직 업데이트 되지 않아 에러 방지를 위한 if문
    if (date.getFullYear() > 2026) return;

    if (isHoliday(date) || date.getDay() === 0 || date.getDay() === 6) {
      substituteHolidayCount++;
    }
  });

  return substituteHolidayCount;
};

export default function Calendar({ user, isLoading }: Props) {
  const { updateUser } = useUserStore();

  useEffect(() => {
    updateUser(user);
  }, [user, updateUser]);

  const {
    prevDate,
    centerDate,
    nextDate,
    containerRef,
    x,
    panelWidth,
    gap,
    dragConstraints,
    isDragEnabled,
    handleDragEnd,
    navigateMonth,
    goToMonth,
    goToToday,
  } = useMonthCarousel();

  const displayYear = centerDate.getFullYear();
  const displayMonth = centerDate.getMonth() + 1;
  const { startDate, endDate } = getMonthQueryRange(centerDate);

  const shift = useShift(startDate, endDate);
  const calendarEvents = toCalendarEvents(shift, displayYear, displayMonth);
  const totalSubstituteHolidays = getTotalSubstituteHolidays(calendarEvents);

  return (
    <div className="w-full h-full md:h-auto md:w-200 md:mx-auto flex flex-col relative">
      <Loading isLoading={isLoading} />
      <CalendarHeader
        displayYear={displayYear}
        displayMonth={displayMonth}
        navigateMonth={navigateMonth}
        onToday={goToToday}
        onSelectMonth={goToMonth}
      />
      {user && (
        <div className="flex pb-1 justify-end">
          <p className="text-sm font-bold">
            {displayMonth}월 대체 휴무 수: {totalSubstituteHolidays}
          </p>
        </div>
      )}
      <ShiftCalendar
        prevDate={prevDate}
        centerDate={centerDate}
        nextDate={nextDate}
        containerRef={containerRef}
        x={x}
        panelWidth={panelWidth}
        gap={gap}
        dragConstraints={dragConstraints}
        isDragEnabled={isDragEnabled}
        onDragEnd={handleDragEnd}
        KoLocal={KoLocal}
      />
    </div>
  );
}
