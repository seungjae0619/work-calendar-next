import { ReactNode, RefObject } from "react";
import { useDialogEvent } from "../hooks/useCalendarLogic";
import FullCalendar from "@fullcalendar/react";
import { Direction } from "../types/calendar";
import CalendarDatePicker from "./CalendarDatePicker";

interface CalendarHeaderProps {
  calendarRef: RefObject<FullCalendar | null>;
  displayYear: number;
  displayMonth: number;
  navigateMonth: (direction: Direction) => void;
}

interface NavigateButtonProps extends Pick<
  CalendarHeaderProps,
  "navigateMonth"
> {
  direction: Direction;
  children: ReactNode;
}

const NavigateButton = ({
  direction,
  navigateMonth,
  children,
}: NavigateButtonProps) => {
  return (
    <>
      <button
        className="text-gray-400 hover:text-gray-700 text-xl px-2"
        onClick={() => navigateMonth(direction)}
      >
        {children}
      </button>
    </>
  );
};

export default function CalendarHeader({
  calendarRef,
  displayYear,
  displayMonth,
  navigateMonth,
}: CalendarHeaderProps) {
  const { handleDatePickerSelect } = useDialogEvent(calendarRef);

  const handleTodayClick = () => {
    calendarRef.current?.getApi().today();
  };
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <NavigateButton direction="right" navigateMonth={navigateMonth}>
        ‹
      </NavigateButton>

      <CalendarDatePicker
        year={displayYear}
        month={displayMonth}
        onSelect={handleDatePickerSelect}
      />
      <div className="flex items-center gap-1">
        <button
          className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors"
          onClick={handleTodayClick}
        >
          오늘
        </button>
        <NavigateButton direction="left" navigateMonth={navigateMonth}>
          ›
        </NavigateButton>
      </div>
    </div>
  );
}
