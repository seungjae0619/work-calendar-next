import {
  DayCellContentArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import { safeGetHolidayNames, safeIsHoliday } from "@/utils/holidays";
import { getWorkTypeStyle } from "../constants";

export const getHolidayClassNames = (arg: DayCellContentArg) => {
  const year = arg.date.getFullYear();
  const month = String(arg.date.getMonth() + 1).padStart(2, "0");
  const day = String(arg.date.getDate()).padStart(2, "0");
  const kstDate = new Date(`${year}-${month}-${day}T00:00:00+09:00`);
  return safeIsHoliday(kstDate) ? ["fc-day-holiday"] : [];
};

export const renderDayCell = (info: DayCellContentArg) => {
  const holidayName = safeGetHolidayNames(info.date)?.[0];
  const isToday = info.isToday && !info.isOther;

  return (
    <div className="flex flex-col items-center w-full">
      <span
        className={`flex items-center justify-center size-6 rounded-full leading-none ${
          isToday ? "bg-primary text-white! font-bold" : ""
        }`}
      >
        {info.dayNumberText.replace("일", "")}
      </span>
      {holidayName && (
        <span className="absolute inset-x-0.5 bottom-0.5 truncate text-center text-[9px] leading-3.5 font-medium md:text-[10px]">
          {holidayName}
        </span>
      )}
    </div>
  );
};

export const renderEventContent = (eventInfo: EventContentArg) => {
  const title = eventInfo.event.title;
  const isChanged = eventInfo.event.extendedProps.isChanged;
  const { color, textColor } = getWorkTypeStyle(title);
  return (
    <div className="flex justify-center w-full items-center cursor-pointer select-none">
      <div
        className="relative size-8 rounded-[10px] flex items-center justify-center text-[13px] font-bold transition-transform duration-150 active:scale-90 sm:size-9 sm:rounded-xl sm:text-[14px]"
        style={{ backgroundColor: color, color: textColor }}
      >
        {title.charAt(0)}
        {isChanged && (
          <div className="absolute -top-1 -right-1 size-2.5 rounded-full bg-red-500 ring-2 ring-surface" />
        )}
      </div>
    </div>
  );
};
