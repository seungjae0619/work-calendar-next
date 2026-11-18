import { getHolidayNamesE, isHolidayE } from "@hyunbinseo/holidays-kr";

// The non-E functions only cover the latest 2 years of the installed package
// (e.g. v3.2027 → 2026–2027) and throw for older years. The E (extended)
// variants cover every bundled year (2018 onward), so past months keep
// their holidays after a package upgrade.
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
