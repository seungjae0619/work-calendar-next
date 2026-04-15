"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import KoLocal from "@fullcalendar/core/locales/ko";
import { useRef, useState } from "react";
import { isHoliday } from "@hyunbinseo/holidays-kr";
import CalendarStyles from "./CalendarStyles";
import CalendarDialog from "./CalendarDialog";
import CalendarDatePicker from "./CalendarDatePicker";
import { getWorkTypeStyle } from "./constants";
import { useShift } from "@/hooks/useShift";
import { toCalendarEvents } from "@/utils/eventFilter";
import { User } from "@supabase/supabase-js";

interface Props {
  isLoggedIn: User | null;
  isLoading: boolean;
}

interface Event {
  work_type: string;
  date: string;
  changed_work_type: string | null;
}

export default function Calendar({ isLoggedIn, isLoading }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth() + 1);
  const [showEvents, setShowEvents] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calendarRef = useRef<FullCalendar>(null);
  const touchStartX = useRef<number>(0);

  const shift = useShift(startDate, endDate);

  const calendarEvents = showEvents
    ? toCalendarEvents(shift, displayYear, displayMonth)
    : [];

  const navigateMonth = (direction: "left" | "right") => {
    if (isAnimating) return;
    const api = calendarRef.current?.getApi();

    setShowEvents(false);
    setSlideDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      if (direction === "left") api?.next();
      else api?.prev();

      setSlideDirection(null);
      setIsAnimating(false);
      setShowEvents(true);
    }, 250);
  };

  const handleDatePickerSelect = (year: number, month: number) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const current = api.getDate();
    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth() + 1;
    const diff = (year - currentYear) * 12 + (month - currentMonth);

    if (diff === 0) return;

    for (let i = 0; i < Math.abs(diff); i++) {
      if (diff > 0) api.next();
      else api.prev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    navigateMonth(diff > 0 ? "left" : "right");
  };

  return (
    <>
      <CalendarStyles />
      <div
        className={`w-full h-full md:h-[480px] md:w-[800px] md:mx-auto flex flex-col relative 
          ${slideDirection === "left" ? "fc-slide-left" : ""}
          ${slideDirection === "right" ? "fc-slide-right" : ""}
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-lg">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-gray-400 hover:text-gray-700 text-xl px-2"
            onClick={() => navigateMonth("right")}
          >
            ‹
          </button>
          <CalendarDatePicker
            year={displayYear}
            month={displayMonth}
            onSelect={handleDatePickerSelect}
          />
          <div className="flex items-center gap-1">
            <button
              className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors"
              onClick={() => {
                calendarRef.current?.getApi().today();
              }}
            >
              오늘
            </button>
            <button
              className="text-gray-400 hover:text-gray-700 text-xl px-2"
              onClick={() => navigateMonth("left")}
            >
              ›
            </button>
          </div>
        </div>

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
          dayCellContent={(info) => {
            return info.dayNumberText.replace("일", "");
          }}
          datesSet={(info) => {
            const year = info.view.currentStart.getFullYear();
            const month = info.view.currentStart.getMonth();

            setDisplayYear(year);
            setDisplayMonth(month + 1);

            const startDate = new Date(year, month, 2);
            const endDate = new Date(year, month + 1, 1);
            const format = (date: Date) => date.toISOString().split("T")[0];

            setStartDate(format(startDate));
            setEndDate(format(endDate));
          }}
          dayCellClassNames={(arg) => {
            try {
              const year = arg.date.getFullYear();
              const month = String(arg.date.getMonth() + 1).padStart(2, "0");
              const day = String(arg.date.getDate()).padStart(2, "0");
              const kstDate = new Date(
                `${year}-${month}-${day}T00:00:00+09:00`,
              );
              return isHoliday(kstDate) ? ["fc-day-holiday"] : [];
            } catch {
              return [];
            }
          }}
          eventClick={(eventInfo) => {
            if (!isLoggedIn) {
              alert("로그인이 필요합니다.");
              return;
            }
            const shiftData = shift.find(
              (s) => s.date === eventInfo.event.startStr,
            );
            setDialogOpen(true);
            setSelectedEvent({
              work_type: shiftData?.work_type || "",
              date: eventInfo.event.startStr,
              changed_work_type: shiftData?.changed_work_type || null,
            });
            setSelected(shiftData?.changed_work_type || "");
          }}
          eventContent={(eventInfo) => {
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
          }}
        />
        <CalendarDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selectedEvent={selectedEvent}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </>
  );
}
