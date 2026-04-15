import { supabase } from "../supabase/client";

export async function updateShift(date: string, changedWorkType: string) {
  const { data, error } = await supabase
    .from("shift")
    .update({ changed_work_type: changedWorkType })
    .eq("date", date);

  if (error) throw error;
  return data;
}
