"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const { mutate: updateShift, isPending } = useEditShift();
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
      <DialogContent>
        <DialogInfoHeader selectedEvent={selectedEvent} />

        <ShiftWorkTypes selected={selected} setSelected={setSelected} />

        {errorMessage && (
          <p className="-mt-2 px-1 text-[14px] font-medium text-danger">
            {errorMessage}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="weak"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
          <Button
            size="lg"
            className="flex-[2]!"
            onClick={handleSubmit}
            disabled={isSubmitDisabled || isPending}
          >
            {isPending ? "변경 중..." : "변경하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
