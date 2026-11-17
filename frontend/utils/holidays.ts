import { getHolidayNames, isHoliday } from "@hyunbinseo/holidays-kr";

export const safeIsHoliday = (date: Date): boolean => {
  try {
    return isHoliday(date);
  } catch {
    return false;
  }
};

export const safeGetHolidayNames = (date: Date): readonly string[] | null => {
  try {
    return getHolidayNames(date);
  } catch {
    return null;
  }
};
