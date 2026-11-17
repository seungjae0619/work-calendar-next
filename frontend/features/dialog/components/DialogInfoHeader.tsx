import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getWorkTypeLabel } from "@/features/calendar/constants";
import { Event } from "@/types/shift";

const formatKoreanDate = (date: string | undefined) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
    weekday: "long",
  });
  return `${month}월 ${day}일 ${weekday}`;
};

export default function DialogInfoHeader({
  selectedEvent,
}: {
  selectedEvent: Event | undefined;
}) {
  const isChanged =
    !!selectedEvent?.changed_work_type &&
    selectedEvent.changed_work_type !== selectedEvent.work_type;

  return (
    <div className="flex flex-col gap-5">
      <DialogHeader>
        <span className="text-[14px] font-medium text-weak">
          {selectedEvent?.date}
        </span>
        <DialogTitle>{formatKoreanDate(selectedEvent?.date)}</DialogTitle>
        <DialogDescription>어떤 근무로 바꿀까요?</DialogDescription>
      </DialogHeader>

      <dl className="flex flex-col gap-3 rounded-2xl bg-surface-muted px-5 py-4 text-[15px]">
        <div className="flex items-center justify-between">
          <dt className="text-sub">본근무</dt>
          <dd className="font-semibold text-strong">
            {getWorkTypeLabel(selectedEvent?.work_type)}
          </dd>
        </div>
        {isChanged && (
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 text-sub">
              변경된 근무
              <span className="size-1.5 rounded-full bg-red-500" />
            </dt>
            <dd className="font-semibold text-danger">
              {getWorkTypeLabel(selectedEvent?.changed_work_type)}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
