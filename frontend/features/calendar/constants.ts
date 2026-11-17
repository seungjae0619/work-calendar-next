export const WORK_TYPES = [
  {
    id: "주",
    label: "주간",
    color: "var(--shift-day-bg)",
    textColor: "var(--shift-day-text)",
  },
  {
    id: "야",
    label: "야간",
    color: "var(--shift-night-bg)",
    textColor: "var(--shift-night-text)",
  },
  {
    id: "휴",
    label: "휴무",
    color: "var(--shift-off-bg)",
    textColor: "var(--shift-off-text)",
  },
] as const;

export type WorkTypeId = (typeof WORK_TYPES)[number]["id"];

export const getWorkTypeStyle = (title: string) => {
  const workType = WORK_TYPES.find((b) => b.id === title);
  return {
    color: workType?.color ?? "",
    textColor: workType?.textColor ?? "",
  };
};

export const getWorkTypeLabel = (id: string | null | undefined) =>
  WORK_TYPES.find((b) => b.id === id)?.label ?? id ?? "";
