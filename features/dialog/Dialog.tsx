"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditShift } from "@/hooks/useEditShift";
import { Event } from "@/types/shift";
import DialogInfoHeader from "./components/DialogInfoHeader";
import ShiftWorkTypes from "./components/ShiftWorkTypes";

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

  const handleSubmit = () => {
    if (selected && selectedEvent?.date) {
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
