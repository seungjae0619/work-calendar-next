"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import KoLocal from "@fullcalendar/core/locales/ko";
import { ReactNode, TouchEvent, useRef } from "react";
import CalendarStyles from "./components/CalendarStyles";
import CalendarDialog from "../dialog/Dialog";
import { User } from "@supabase/supabase-js";
import {
  getHolidayClassNames,
  renderDayCell,
  renderEventContent,
} from "./components/CalendarRenderer";
import { useCalendarDate, useNavigateMonth } from "./hooks/useCalendarLogic";
import { usePrefetch } from "@/hooks/usePrefetch";
import CalendarHeader from "./components/CalendarHeader";

type Direction = "left" | "right";
interface Props {
  user: User | null;
  isLoading: boolean;
}

interface SlideContainerProps {
  slideDirection: Direction | null;
  handleTouchStart: (e: TouchEvent<Element>) => void;
  handleTouchEnd: (e: TouchEvent<Element>) => void;
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
      className={`w-full h-full md:h-[480px] md:w-[800px] md:mx-auto flex flex-col relative ${
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

  usePrefetch();

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
  } = useCalendarDate(user);

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
          displayYear={displayYear}
          displayMonth={displayMonth}
          navigateMonth={navigateMonth}
        />
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
      </SlideContainer>
    </>
  );
}
