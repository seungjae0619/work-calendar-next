import {
  DayCellContentArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import { getWorkTypeStyle } from "./constants";

export const renderDayCell = (info: DayCellContentArg) => {
  return info.dayNumberText.replace("일", "");
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
