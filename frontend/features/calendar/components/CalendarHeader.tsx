import { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const NavigateButton = ({ children, ...props }: NavigateButtonProps) => {
  return (
    <button
      type="button"
      className="flex size-9 items-center justify-center rounded-full text-sub transition-[background-color,transform] hover:bg-surface-muted active:scale-90"
      {...props}
    >
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
    <div className="flex items-center justify-between pl-2 pr-1 pb-4">
      <CalendarDatePicker
        year={displayYear}
        month={displayMonth}
        onSelect={onSelectMonth}
      />
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className="mr-1 h-8 rounded-lg bg-surface-muted px-3 text-[13px] font-semibold text-body transition-[background-color,transform] hover:bg-surface-pressed active:scale-95"
          onClick={onToday}
        >
          오늘
        </button>
        <NavigateButton
          aria-label="이전 달"
          onClick={() => navigateMonth("left")}
        >
          <ChevronLeft className="size-5" />
        </NavigateButton>
        <NavigateButton
          aria-label="다음 달"
          onClick={() => navigateMonth("right")}
        >
          <ChevronRight className="size-5" />
        </NavigateButton>
      </div>
    </div>
  );
}
