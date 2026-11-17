import { Check } from "lucide-react";
import { WORK_TYPES } from "@/features/calendar/constants";

export default function ShiftWorkTypes({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (value: string) => void;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2">
      {WORK_TYPES.map((type) => {
        const isSelected = selected === type.id;
        return (
          <button
            key={type.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={type.id}
            className={`relative flex flex-col items-center gap-2 rounded-2xl py-4 transition-[background-color,box-shadow,transform] duration-150 active:scale-95 ${
              isSelected
                ? "bg-primary-weak ring-2 ring-primary ring-inset"
                : "bg-surface-muted hover:bg-surface-pressed"
            }`}
            onClick={() => setSelected(type.id)}
          >
            {isSelected && (
              <Check
                className="absolute top-2 right-2 size-4 text-primary"
                strokeWidth={3}
              />
            )}
            <span
              className="flex size-10 items-center justify-center rounded-xl text-[16px] font-bold"
              style={{ backgroundColor: type.color, color: type.textColor }}
            >
              {type.id}
            </span>
            <span
              className={`text-[15px] font-semibold ${isSelected ? "text-primary" : "text-body"}`}
            >
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
