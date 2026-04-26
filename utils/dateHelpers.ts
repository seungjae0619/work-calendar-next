export const getMonthRange = (year: number, month: number) => {
  const startDate = new Date(year, month, 2).toISOString().split("T")[0];
  const endDate = new Date(year, month + 1, 1).toISOString().split("T")[0];
  return { startDate, endDate };
};
