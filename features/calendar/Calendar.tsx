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
import { motion } from "framer-motion";
import { CalendarEvent } from "./types/calendar";

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
    <motion.div
      initial={false}
      animate={{
        x:
          slideDirection === "left" ? 60 : slideDirection === "right" ? -60 : 0,
        opacity: slideDirection ? 0 : 1,
      }}
      transition={{
        duration: slideDirection ? 0.25 : 0,
        ease: "easeOut",
      }}
      className="w-full h-full md:h-130 md:w-200 md:mx-auto flex flex-col relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </motion.div>
  );
};

const getTotalSubstituteHolidays = (calendarEvents: CalendarEvent[]) => {
  let substituteHolidayCount = 0;

  calendarEvents.forEach((item) => {
    const date = new Date(item.start);

    // kr-holidays 라이브러리가 2027년 공휴일이 아직 없어서 에러 방지를 위한 if문
    if (date.getFullYear() > 2026) return;

    if (isHoliday(date) || date.getDay() === 0 || date.getDay() === 6) {
      substituteHolidayCount++;
    }
  });

  return substituteHolidayCount;
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

  const totalSubstituteHolidays = getTotalSubstituteHolidays(calendarEvents);

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
            <p className="text-sm font-bold">
              {displayMonth}월 대체 휴무 수: {totalSubstituteHolidays}
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
