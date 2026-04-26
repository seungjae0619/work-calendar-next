import { DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import { useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useShift } from "../../../hooks/useShift";
import { toCalendarEvents } from "@/utils/eventFilter";
import useCalendarStore from "@/store/calendar";

interface Props {
  isLoggedIn: User | null;
  calendarRef: React.RefObject<FullCalendar | null>;
}

interface Event {
  work_type: string;
  date: string;
  changed_work_type: string | null;
}

export const useCalendarDate = (isLoggedIn: Props["isLoggedIn"]) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const {
    startDate,
    endDate,
    displayYear,
    displayMonth,
    updateStartDate,
    updateEndDate,
    setDisplayDate,
  } = useCalendarStore();

  const shift = useShift(startDate, endDate);

  const handleEventClick = (eventInfo: EventClickArg) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    const shiftData = shift.find((s) => s.date === eventInfo.event.startStr);
    setDialogOpen(true);
    setSelectedEvent({
      work_type: shiftData?.work_type || "",
      date: eventInfo.event.startStr,
      changed_work_type: shiftData?.changed_work_type || null,
    });
    setSelected(shiftData?.changed_work_type || "");
  };

  const handleDatesSet = (info: DatesSetArg) => {
    const year = info.view.currentStart.getFullYear();
    const month = info.view.currentStart.getMonth();

    setDisplayDate(year, month + 1);

    const startDate = new Date(year, month, 2);
    const endDate = new Date(year, month + 1, 1);
    const format = (date: Date) => date.toISOString().split("T")[0];

    updateStartDate(format(startDate));
    updateEndDate(format(endDate));
  };

  return {
    dialogOpen,
    selected,
    selectedEvent,
    displayYear,
    displayMonth,

    setDialogOpen,
    setSelected,

    handleEventClick,
    handleDatesSet,
  };
};

export const useNavigateMonth = (calendarRef: Props["calendarRef"]) => {
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEvents, setShowEvents] = useState(true);

  const { startDate, endDate, displayYear, displayMonth } = useCalendarStore();

  const shift = useShift(startDate, endDate);

  const touchStartX = useRef<number>(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    navigateMonth(diff > 0 ? "left" : "right");
  };

  const calendarEvents = showEvents
    ? toCalendarEvents(shift, displayYear, displayMonth)
    : [];

  return {
    slideDirection,
    showEvents,
    calendarEvents,
    navigateMonth,
    handleTouchStart,
    handleTouchEnd,
  };
};

export const useDialogEvent = (calendarRef: Props["calendarRef"]) => {
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

  return {
    handleDatePickerSelect,
  };
};
