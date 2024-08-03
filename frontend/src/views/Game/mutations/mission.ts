import mission from "@/api/playing/mission";
import { getGameHandler } from "@/shared/Game";
import { Game } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useMission(gameId: string, playerId: string, token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hack: boolean) => {
      const res = await mission(gameId, token, hack);
      if (!res.ok) {
        toast.error(res.msg);
        console.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (hack: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["game", gameId] });

      const previousGame = queryClient.getQueryData<Game>(["game", gameId]);

      if (!previousGame) {
        return { previousGame: null, newGame: null };
      }

      const gameHandler = getGameHandler(previousGame);

      try {
        gameHandler.doMission(playerId, hack);
        // Don't prematurely end voting phase, could cause ui bugs
        gameHandler.game.phase = "mission";

        queryClient.setQueryData(["game", gameId], gameHandler.game);

        return { previousGame, newGame: gameHandler.game };
      } catch {
        return { previousGame, newGame: null };
      }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _newCharacter, context) => {
      console.log(_err);
      queryClient.setQueryData(["game", gameId], context?.previousGame);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}

export default useMission;
