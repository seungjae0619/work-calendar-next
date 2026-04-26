import { getShift } from "@/lib/api/shift";
import useDateStore from "@/store/date/date";
import { getMonthRange } from "@/utils/dateHelpers";
import { useQueryClient } from "@tanstack/react-query";

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const currentDate = new Date(useDateStore((state) => state.currentDate));

  const prevRange = getMonthRange(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
  );
  const nextRange = getMonthRange(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
  );

  queryClient.prefetchQuery({
    queryKey: ["shifts", prevRange.startDate, prevRange.endDate],
    queryFn: () => getShift(prevRange.startDate, prevRange.endDate),
    staleTime: 1000 * 60 * 5,
  });

  queryClient.prefetchQuery({
    queryKey: ["shifts", nextRange.startDate, nextRange.endDate],
    queryFn: () => getShift(nextRange.startDate, nextRange.endDate),
    staleTime: 1000 * 60 * 5,
  });
};
