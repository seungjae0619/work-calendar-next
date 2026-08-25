import { ButtonHTMLAttributes, ReactNode } from "react";
import { Direction } from "../types/calendar";
import CalendarDatePicker from "./CalendarDatePicker";

interface CalendarHeaderProps {
  displayYear: number;
  displayMonth: number;
  navigateMonth: (direction: Direction) => void;
  onToday: () => void;
  onSelectMonth: (year: number, month: number) => void;
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
  displayYear,
  displayMonth,
  navigateMonth,
  onToday,
  onSelectMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <NavigateButton onClick={() => navigateMonth("left")}>‹</NavigateButton>

      <CalendarDatePicker
        year={displayYear}
        month={displayMonth}
        onSelect={onSelectMonth}
      />
      <div className="flex items-center gap-1">
        <button
          className="text-xs border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-500 transition-colors"
          onClick={onToday}
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
