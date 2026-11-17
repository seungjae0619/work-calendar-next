"use client";

import KoLocal from "@fullcalendar/core/locales/ko";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useMonthCarousel } from "./hooks/useCalendarLogic";
import CalendarHeader from "./components/CalendarHeader";
import ShiftCalendar from "./components/ShiftCalendar";
import useUserStore from "@/store/user";
import { useShift } from "@/hooks/useShift";
import { toCalendarEvents } from "@/utils/eventFilter";
import { getMonthQueryRange } from "@/utils/dateHelpers";
import { safeIsHoliday } from "@/utils/holidays";
import { CalendarEvent } from "./types/calendar";
import { WORK_TYPES } from "./constants";

interface Props {
  user: User | null;
  isLoading: boolean;
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/60 rounded-3xl">
          <div className="size-8 border-[3px] border-line border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </>
  );
};

const WorkTypeLegend = () => (
  <div className="flex items-center justify-center gap-4 pt-1">
    {WORK_TYPES.map((type) => (
      <div key={type.id} className="flex items-center gap-1.5">
        <span
          className="flex size-5 items-center justify-center rounded-md text-[11px] font-bold"
          style={{ backgroundColor: type.color, color: type.textColor }}
        >
          {type.id}
        </span>
        <span className="text-[13px] font-medium text-weak">{type.label}</span>
      </div>
    ))}
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-red-500" />
      <span className="text-[13px] font-medium text-weak">변경됨</span>
    </div>
  </div>
);

const getTotalSubstituteHolidays = (calendarEvents: CalendarEvent[]) => {
  let substituteHolidayCount = 0;

  calendarEvents.forEach((item) => {
    const date = new Date(item.start);

    if (safeIsHoliday(date) || date.getDay() === 0 || date.getDay() === 6) {
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
    <div className="relative flex w-full flex-col gap-3">
      <Loading isLoading={isLoading} />
      {user && (
        <section className="flex items-center justify-between rounded-3xl bg-surface px-6 py-5 shadow-[var(--shadow-card)]">
          <p className="text-[15px] font-medium text-sub">
            {displayMonth}월 대체 휴무
          </p>
          <p className="text-[22px] font-bold text-primary">
            {totalSubstituteHolidays}
            <span className="ml-0.5 text-[17px] font-semibold">일</span>
          </p>
        </section>
      )}
      <section className="rounded-3xl bg-surface px-2 pt-5 pb-3 shadow-[var(--shadow-card)] sm:px-4">
        <CalendarHeader
          displayYear={displayYear}
          displayMonth={displayMonth}
          navigateMonth={navigateMonth}
          onToday={goToToday}
          onSelectMonth={goToMonth}
        />
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
      </section>
      <WorkTypeLegend />
    </div>
  );
}
