import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTask } from "@/utils/api/admin.moderation.api";

export function useRemoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { taskId: string; reason?: string; notes?: string }) =>
      removeTask(args.taskId, { reason: args.reason, notes: args.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    },
  });
}

