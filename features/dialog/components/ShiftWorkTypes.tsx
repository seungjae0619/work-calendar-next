import { WORK_TYPES } from "@/features/calendar/constants";

export default function ShiftWorkTypes({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (value: string) => void;
}) {
  return (
    <div className="flex gap-3 items-center">
      {WORK_TYPES.map((button) => (
        <button
          key={button.id}
          className={`flex items-center justify-center rounded-full w-7 h-7 hover:opacity-80 cursor-pointer font-bold text-sm ${
            selected === button.id ? "ring-3 ring-blue-400" : ""
          }`}
          style={{ backgroundColor: button.color, color: button.textColor }}
          onClick={() => {
            setSelected(button.id);
          }}
        >
          {button.id}
        </button>
      ))}
    </div>
  );
}
