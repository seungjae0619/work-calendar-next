import { supabase } from "../supabase/client";

export const LOGIN_REQUIRED_MESSAGE = "로그인이 필요합니다.";
export const UPDATE_FAILED_MESSAGE = "근무 변경 내용이 저장되지 않았습니다.";

export async function getShift(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("shift")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) throw error;
  return data ?? [];
}

export async function updateShift(date: string, changedWorkType: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error(LOGIN_REQUIRED_MESSAGE);
  }

  const { data, error } = await supabase
    .from("shift")
    .update({ changed_work_type: changedWorkType })
    .eq("date", date)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(UPDATE_FAILED_MESSAGE);
  }
  return data;
}
