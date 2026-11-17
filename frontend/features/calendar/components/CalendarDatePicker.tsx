"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

export default function CalendarDatePicker({ year, month, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);

  const handleToggle = () => {
    setPickerYear(year);
    setOpen((v) => !v);
  };

  const handleMonthClick = (i: number) => {
    onSelect(pickerYear, i + 1);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-lg px-1 py-0.5 text-[22px] font-bold text-strong transition-transform active:scale-[0.97]"
        onClick={handleToggle}
      >
        {year}년 {month}월
        <ChevronDown
          className={`size-5 text-weak transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="popover-enter absolute top-11 left-0 z-30 w-72 rounded-3xl bg-surface p-5 shadow-[var(--shadow-popover)]">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                aria-label="이전 해"
                className="flex size-8 items-center justify-center rounded-full text-sub hover:bg-surface-muted"
                onClick={() => setPickerYear((y) => y - 1)}
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="text-[17px] font-bold text-strong">
                {pickerYear}년
              </span>
              <button
                type="button"
                aria-label="다음 해"
                className="flex size-8 items-center justify-center rounded-full text-sub hover:bg-surface-muted"
                onClick={() => setPickerYear((y) => y + 1)}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {MONTHS.map((label, i) => {
                const isSelected = pickerYear === year && i + 1 === month;
                return (
                  <button
                    type="button"
                    key={label}
                    className={`h-11 rounded-xl text-[15px] font-semibold transition-[background-color,transform] active:scale-95 ${
                      isSelected
                        ? "bg-primary text-white"
                        : "text-body hover:bg-surface-muted"
                    }`}
                    onClick={() => handleMonthClick(i)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
