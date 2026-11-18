import { getHolidayNamesE, isHolidayE } from "@hyunbinseo/holidays-kr";

export const safeIsHoliday = (date: Date): boolean => {
  try {
    return isHolidayE(date);
  } catch {
    return false;
  }
};

export const safeGetHolidayNames = (date: Date): readonly string[] | null => {
  try {
    return getHolidayNamesE(date);
  } catch {
    return null;
  }
};
