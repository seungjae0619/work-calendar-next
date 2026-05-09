import { ReactNode, RefObject } from "react";
import { useDialogEvent } from "../hooks/useCalendarLogic";
import FullCalendar from "@fullcalendar/react";
import { Direction } from "../types/calendar";
import CalendarDatePicker from "./CalendarDatePicker";
import useCalendarStore from "@/store/calendar";

interface CalendarHeaderProps {
  calendarRef: RefObject<FullCalendar | null>;
  navigateMonth: (direction: Direction) => void;
}

interface NavigateButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const NavigateButton = ({ onClick, children }: NavigateButtonProps) => {
  return (
    <>
      <button
        className="text-gray-400 hover:text-gray-700 text-xl px-2"
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export default function CalendarHeader({
  calendarRef,
  navigateMonth,
}: CalendarHeaderProps) {
  const { handleDatePickerSelect } = useDialogEvent(calendarRef);
  const { displayYear, displayMonth } = useCalendarStore();

  const handleTodayClick = () => {
    calendarRef.current?.getApi().today();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <NavigateButton onClick={() => navigateMonth("right")}>‹</NavigateButton>

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
        <NavigateButton onClick={() => navigateMonth("left")}>›</NavigateButton>
      </div>
    </div>
  );
}
