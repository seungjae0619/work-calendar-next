const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const getMonthQueryRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    startDate: formatDate(new Date(year, month, 1)),
    endDate: formatDate(new Date(year, month + 1, 1)),
  };
};
