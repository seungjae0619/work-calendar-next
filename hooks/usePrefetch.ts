import { getShift } from "@/lib/api/shift";
import useCalendarStore from "@/store/calendar";
import { getMonthRange } from "@/utils/dateHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const currentDatevalue = useCalendarStore((state) => state.currentDate);

  useEffect(() => {
    if (!currentDatevalue) return;

    console.log("prefetch called");

    const currentDate = new Date(currentDatevalue);

    const prevRange = getMonthRange(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
    );
    const nextRange = getMonthRange(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
    );
    queryClient.prefetchQuery({
      queryKey: ["shift", prevRange.startDate, prevRange.endDate],
      queryFn: () => getShift(prevRange.startDate, prevRange.endDate),
      staleTime: 1000 * 60 * 5,
    });

    queryClient.prefetchQuery({
      queryKey: ["shift", nextRange.startDate, nextRange.endDate],
      queryFn: () => getShift(nextRange.startDate, nextRange.endDate),
      staleTime: 1000 * 60 * 5,
    });
  }, [currentDatevalue, queryClient]);
};
