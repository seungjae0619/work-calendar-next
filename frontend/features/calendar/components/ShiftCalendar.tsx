"use client";

import { motion, MotionValue, PanInfo } from "framer-motion";
import { RefObject, useCallback, useState } from "react";
import { LocaleInput } from "@fullcalendar/core/index.js";
import useUserStore from "@/store/user";
import MonthPanel from "./MonthPanel";
import CalendarDialog from "@/features/dialog/Dialog";
import { ShiftEvent } from "../types/calendar";
import { SNAP_DURATION } from "../hooks/useCalendarLogic";

interface ShiftCalendarProps {
  prevDate: Date;
  centerDate: Date;
  nextDate: Date;
  targetDate: Date;
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
  targetDate,
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
  const [panelHeights, setPanelHeights] = useState<Record<number, number>>({});

  const handleHeightChange = useCallback((time: number, height: number) => {
    setPanelHeights((prev) =>
      prev[time] === height ? prev : { ...prev, [time]: height },
    );
  }, []);

  const containerHeight = panelHeights[targetDate.getTime()];

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
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          height: containerHeight ?? "auto",
          transition: `height ${SNAP_DURATION}s ease-out`,
        }}
      >
        {panelWidth > 0 && (
          <motion.div
            className="flex items-start"
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
              onHeightChange={handleHeightChange}
            />
            <MonthPanel
              key={centerDate.getTime()}
              date={centerDate}
              width={panelWidth}
              KoLocal={KoLocal}
              onEventClick={handleEventClick}
              onHeightChange={handleHeightChange}
            />
            <MonthPanel
              key={nextDate.getTime()}
              date={nextDate}
              width={panelWidth}
              KoLocal={KoLocal}
              onEventClick={handleEventClick}
              onHeightChange={handleHeightChange}
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
