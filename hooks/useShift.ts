import { supabase } from "@/lib/supabase/client";
import { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";

export function useShift(startDate: string, endDate: string) {
  const { data: shift = [] } = useQuery<Shift[]>({
    queryKey: ["shift", startDate, endDate],
    queryFn: async () => {
      const { data } = await supabase
        .from("shift")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);
      return data ?? [];
    },
  });

  return shift;
}
