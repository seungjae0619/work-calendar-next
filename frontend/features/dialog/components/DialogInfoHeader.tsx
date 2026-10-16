import { DialogHeader } from "@/components/ui/dialog";
import { Event } from "@/types/shift";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default function DialogInfoHeader({
  selectedEvent,
}: {
  selectedEvent: Event | undefined;
}) {
  return (
    <DialogHeader>
      <DialogTitle>
        <span className="text-white">{selectedEvent?.date}</span>
        <p className="text-white text-sm">
          본근무 : {selectedEvent?.work_type}
        </p>
        {selectedEvent?.changed_work_type &&
        selectedEvent?.changed_work_type !== selectedEvent.work_type ? (
          <p className="text-red-400 text-sm flex items-center gap-1">
            변경됨 : {selectedEvent.changed_work_type}
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </p>
        ) : null}
      </DialogTitle>
      <DialogDescription className="sr-only">
        근무 변경 다이얼로그
      </DialogDescription>
    </DialogHeader>
  );
}
