"use client";

import FullCalendar from "@fullcalendar/react";
import KoLocal from "@fullcalendar/core/locales/ko";
import { ReactNode, TouchEvent, useEffect, useRef } from "react";
import CalendarStyles from "./components/CalendarStyles";
import { User } from "@supabase/supabase-js";
import { useNavigateMonth } from "./hooks/useCalendarLogic";

import CalendarHeader from "./components/CalendarHeader";
import ShiftCalendar from "./components/ShiftCalendar";
import useUserStore from "@/store/user";

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

  return (
    <>
      <CalendarStyles />
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
        <ShiftCalendar
          calendarEvents={calendarEvents}
          KoLocal={KoLocal}
          calendarRef={calendarRef}
        />
      </SlideContainer>
    </>
  );
}
