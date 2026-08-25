"use client";

import { motion, MotionValue, PanInfo } from "framer-motion";
import { RefObject, useState } from "react";
import { LocaleInput } from "@fullcalendar/core/index.js";
import useUserStore from "@/store/user";
import MonthPanel from "./MonthPanel";
import CalendarDialog from "@/features/dialog/Dialog";
import { ShiftEvent } from "../types/calendar";

interface ShiftCalendarProps {
  prevDate: Date;
  centerDate: Date;
  nextDate: Date;
  containerRef: RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  panelWidth: number;
  gap: number;
  dragConstraints: { left: number; right: number };
  isDragEnabled: boolean;
  onDragEnd: (
    event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => void;
  KoLocal: LocaleInput;
}

export default function ShiftCalendar({
  prevDate,
  centerDate,
  nextDate,
  containerRef,
  x,
  panelWidth,
  gap,
  dragConstraints,
  isDragEnabled,
  onDragEnd,
  KoLocal,
}: ShiftCalendarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ShiftEvent | undefined>();
  const { user } = useUserStore();

  const handleEventClick = (shiftEvent: ShiftEvent) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setDialogOpen(true);
    setSelectedEvent(shiftEvent);
    setSelected(shiftEvent.changed_work_type || "");
  };

  return (
    <>
      <div ref={containerRef} className="relative overflow-x-hidden">
        {panelWidth > 0 && (
          <motion.div
            className="flex"
            style={{ x, columnGap: gap }}
            drag={isDragEnabled ? "x" : false}
            dragConstraints={dragConstraints}
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            <MonthPanel
              key={prevDate.getTime()}
              date={prevDate}
              width={panelWidth}
              KoLocal={KoLocal}
              onEventClick={handleEventClick}
            />
            <MonthPanel
              key={centerDate.getTime()}
              date={centerDate}
              width={panelWidth}
              KoLocal={KoLocal}
              onEventClick={handleEventClick}
            />
            <MonthPanel
              key={nextDate.getTime()}
              date={nextDate}
              width={panelWidth}
              KoLocal={KoLocal}
              onEventClick={handleEventClick}
            />
          </motion.div>
        )}
      </div>
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
