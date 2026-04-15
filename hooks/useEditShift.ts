import { updateShift } from "@/lib/api/shift";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditShiftParams {
  date: string;
  changedWorkType: string;
}

export function useEditShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, changedWorkType }: EditShiftParams) => {
      await updateShift(date, changedWorkType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift"] });
    },
  });
}
