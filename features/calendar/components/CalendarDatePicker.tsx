"use client";

import { useEffect, useState } from "react";

interface Props {
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
}

const MONTHS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

export default function CalendarDatePicker({ year, month, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);

  useEffect(() => {
    setPickerYear(year);
  }, [year]);

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="text-base font-semibold text-gray-800 tracking-wide hover:text-gray-500 transition-colors"
        onClick={() => {
          setPickerYear(year);
          setOpen((v) => !v);
        }}
      >
        {year}년 {month}월 ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
            <div className="flex items-center justify-between mb-3">
              <button
                className="text-gray-400 hover:text-gray-700 px-2 text-lg"
                onClick={() => setPickerYear((y) => y - 1)}
              >
                ‹
              </button>
              <span className="font-semibold text-gray-800">
                {pickerYear}년
              </span>
              <button
                className="text-gray-400 hover:text-gray-700 px-2 text-lg"
                onClick={() => setPickerYear((y) => y + 1)}
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {MONTHS.map((label, i) => {
                const isSelected = pickerYear === year && i + 1 === month;
                return (
                  <button
                    key={label}
                    className={`py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => {
                      onSelect(pickerYear, i + 1);
                      setOpen(false);
                    }}
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
