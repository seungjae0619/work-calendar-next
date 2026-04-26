export const WORK_TYPES = [
  { id: "주", color: "#ffd600", textColor: "#3c3c3c" },
  { id: "야", color: "#424242", textColor: "#ffffff" },
  { id: "휴", color: "#ffffff", textColor: "#f05a6e" },
] as const;

export type WorkTypeId = (typeof WORK_TYPES)[number]["id"];

export const getWorkTypeStyle = (title: string) => ({
  color: WORK_TYPES.find((b) => b.id === title)?.color || "",
  textColor: WORK_TYPES.find((b) => b.id === title)?.textColor || "",
});
