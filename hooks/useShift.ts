import { getShift } from "@/lib/api/shift";
import { Shift } from "@/types/shift";
import { useQuery } from "@tanstack/react-query";

export function useShift(startDate: string, endDate: string) {
  const { data: shift = [] } = useQuery<Shift[]>({
    queryKey: ["shift", startDate, endDate],
    queryFn: () => getShift(startDate, endDate),
  });

  return shift;
}
