"use client";

import FullCalendar from "@fullcalendar/react";
import KoLocal from "@fullcalendar/core/locales/ko";
import { ReactNode, TouchEvent, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigateMonth } from "./hooks/useCalendarLogic";
import { isHoliday } from "@hyunbinseo/holidays-kr";
import CalendarHeader from "./components/CalendarHeader";
import ShiftCalendar from "./components/ShiftCalendar";
import useUserStore from "@/store/user";
import useCalendarStore from "@/store/calendar";

type Direction = "left" | "right";
interface Props {
  user: User | null;
  isLoading: boolean;
}

interface SlideContainerProps {
  slideDirection: Direction | null;
  handleTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: TouchEvent<HTMLDivElement>) => void;
  children: ReactNode;
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

const SlideContainer = ({
  slideDirection,
  handleTouchStart,
  handleTouchEnd,
  children,
}: SlideContainerProps) => {
  return (
    <div
      className={`w-full h-full md:h-130 md:w-200 md:mx-auto flex flex-col relative ${
        slideDirection ? `fc-slide-${slideDirection}` : ""
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

export default function Calendar({ user, isLoading }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const displayMonth = useCalendarStore((state) => state.displayMonth);
  const { updateUser } = useUserStore();

  useEffect(() => {
    updateUser(user);
  }, [user, updateUser]);

  const {
    slideDirection,
    calendarEvents,
    navigateMonth,
    handleTouchStart,
    handleTouchEnd,
  } = useNavigateMonth(calendarRef);

  let count = 0;

  calendarEvents.forEach((item) => {
    const date = new Date(item.start);

    if (isHoliday(date)) {
      count++;
    }
  });

  const countWeekend = (startDate: string, endDate: string) => {
    let count = 0;
    const current = new Date(startDate);

    while (current < new Date(endDate)) {
      if (current.getDay() === 0 || current.getDay() === 6) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  const totalWeekends = countWeekend("2026-05-01", "2026-05-30");

  return (
    <>
      <SlideContainer
        slideDirection={slideDirection}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
      >
        <Loading isLoading={isLoading} />
        <CalendarHeader
          calendarRef={calendarRef}
          navigateMonth={navigateMonth}
        />
        {user && (
          <div className="flex pb-1 justify-end">
            <p className="text-sm font-bold dark:text-white">
              {displayMonth}월 대체 휴무 수: {count + totalWeekends}
            </p>
          </div>
        )}
        <ShiftCalendar
          calendarEvents={calendarEvents}
          KoLocal={KoLocal}
          calendarRef={calendarRef}
        />
      </SlideContainer>
    </>
  );
}
