import startGame from "@/api/startGame";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useStartGame(gameId: string, token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await startGame(gameId, token);
      if (!res.ok) {
        toast.error(res.msg);
        console.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}

export default useStartGame;
