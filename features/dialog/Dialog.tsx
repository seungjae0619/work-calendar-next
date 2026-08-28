"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditShift } from "@/hooks/useEditShift";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/api/shift";
import { Event } from "@/types/shift";
import DialogInfoHeader from "./components/DialogInfoHeader";
import ShiftWorkTypes from "./components/ShiftWorkTypes";

const DEFAULT_ERROR_MESSAGE = "근무 변경에 실패했습니다. 다시 시도해주세요.";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: Event | undefined;
  selected: string;
  setSelected: (value: string) => void;
}

export default function CalendarDialog({
  open,
  onOpenChange,
  selectedEvent,
  selected,
  setSelected,
}: Props) {
  const { mutate: updateShift } = useEditShift();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastEventDate, setLastEventDate] = useState(selectedEvent?.date);

  if (selectedEvent?.date !== lastEventDate) {
    setLastEventDate(selectedEvent?.date);
    setErrorMessage(null);
  }

  const handleSubmit = () => {
    if (selected && selectedEvent?.date) {
      setErrorMessage(null);
      updateShift(
        {
          date: selectedEvent.date,
          changedWorkType: selected,
        },
        {
          onSuccess: () => {
            setSelected("");
            onOpenChange(false);
          },
          onError: (error) => {
            setErrorMessage(
              error instanceof Error && error.message === LOGIN_REQUIRED_MESSAGE
                ? error.message
                : DEFAULT_ERROR_MESSAGE,
            );
          },
        },
      );
    }
  };

  const isSubmitDisabled =
    selected === "" ||
    selected === (selectedEvent?.changed_work_type || selectedEvent?.work_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-500 border-gray-500 w-80 md:w-80">
        <DialogInfoHeader selectedEvent={selectedEvent} />

        <ShiftWorkTypes selected={selected} setSelected={setSelected} />

        {errorMessage && (
          <p className="text-red-400 font-bold text-sm">{errorMessage}</p>
        )}

        <div className="flex justify-end">
          <Button
            className="w-12.5 bg-gray-800 text-white hover:bg-gray-600"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            변경
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
