import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getHolidayClassNames,
  renderDayCell,
  renderEventContent,
} from "../components/CalendarRenderer";
import { CalendarEvent } from "../types/calendar";
import {
  DatesSetArg,
  EventClickArg,
  LocaleInput,
} from "@fullcalendar/core/index.js";
import { RefObject, useState } from "react";
import useCalendarStore from "@/store/calendar";
import useUserStore from "@/store/user";
import { useShift } from "@/hooks/useShift";
import CalendarDialog from "@/features/dialog/Dialog";
import "@/style/calendar.css";

interface ShiftCalendarProps {
  calendarEvents: CalendarEvent[];
  KoLocal: LocaleInput;
  calendarRef: RefObject<FullCalendar | null>;
}

interface ShiftEvent {
  work_type: string;
  date: string;
  changed_work_type: string | null;
}

export default function ShiftCalendar({
  calendarEvents,
  KoLocal,
  calendarRef,
}: ShiftCalendarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ShiftEvent | undefined>();
  const { user } = useUserStore();
  const { startDate, endDate, updateDate, setDisplayDate, updateCurrentDate } =
    useCalendarStore();

  const shift = useShift(startDate, endDate);

  const handleDatesSet = (info: DatesSetArg) => {
    const year = info.view.currentStart.getFullYear();
    const month = info.view.currentStart.getMonth();

    setDisplayDate(year, month + 1);

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    const format = (date: Date) => date.toISOString().split("T")[0];

    updateDate(format(start), format(end));
    updateCurrentDate(format(start));
  };

  const handleEventClick = (eventInfo: EventClickArg) => {
    if (!user) {
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

  return (
    <>
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
        eventContent={renderEventContent}
        dayCellContent={renderDayCell}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        dayCellClassNames={getHolidayClassNames}
      />
      <CalendarDialog
        open={dialogOpen}
        selected={selected}
        selectedEvent={selectedEvent}
        onOpenChange={setDialogOpen}
        setSelected={setSelected}
      />
    </>
  );
}
