import {
  DayCellContentArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import { getHolidayNames, isHoliday } from "@hyunbinseo/holidays-kr";
import { getWorkTypeStyle } from "../constants";

export const getHolidayClassNames = (arg: DayCellContentArg) => {
  try {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, "0");
    const day = String(arg.date.getDate()).padStart(2, "0");
    const kstDate = new Date(`${year}-${month}-${day}T00:00:00+09:00`);
    return isHoliday(kstDate) ? ["fc-day-holiday"] : [];
  } catch {
    return [];
  }
};

export const renderDayCell = (info: DayCellContentArg) => {
  const holidayNames = getHolidayNames(info.date);
  const holidayName = holidayNames?.[0];

  return (
    <div className="flex justify-between items-center gap-1">
      <span>{info.dayNumberText.replace("일", "")}</span>
      {holidayName ? (
        <span className="block text-[8px] max-w-6.5 sm:max-w-12 md:text-[10px] truncate">
          {holidayName}
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export const renderEventContent = (eventInfo: EventContentArg) => {
  const title = eventInfo.event.title;
  const isChanged = eventInfo.event.extendedProps.isChanged;
  const { color, textColor } = getWorkTypeStyle(title);
  return (
    <div className="flex justify-center w-full h-full items-center flex-col hover:cursor-pointer">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold"
        style={{ backgroundColor: color, color: textColor }}
      >
        {title.charAt(0)}
      </div>
      {isChanged && (
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-0.5" />
      )}
    </div>
  );
};
