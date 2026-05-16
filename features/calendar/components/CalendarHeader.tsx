import { ButtonHTMLAttributes, ReactNode, RefObject } from "react";
import { useDialogEvent } from "../hooks/useCalendarLogic";
import FullCalendar from "@fullcalendar/react";
import { Direction } from "../types/calendar";
import CalendarDatePicker from "./CalendarDatePicker";
import useCalendarStore from "@/store/calendar";

interface CalendarHeaderProps {
  calendarRef: RefObject<FullCalendar | null>;
  navigateMonth: (direction: Direction) => void;
}

interface NavigateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const NavigateButton = ({ onClick, children }: NavigateButtonProps) => {
  return (
    <button className="text-xl px-2 hover:text-gray-400" onClick={onClick}>
      {children}
    </button>
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
      <NavigateButton onClick={() => navigateMonth("left")}>‹</NavigateButton>

      <CalendarDatePicker
        year={displayYear}
        month={displayMonth}
        onSelect={handleDatePickerSelect}
      />
      <div className="flex items-center gap-1">
        <button
          className="text-xs border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-500 transition-colors"
          onClick={handleTodayClick}
        >
          오늘
        </button>
        <NavigateButton onClick={() => navigateMonth("right")}>
          ›
        </NavigateButton>
      </div>
    </div>
  );
}
