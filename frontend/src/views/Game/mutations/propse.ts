import propose from "@/api/playing/propose";
import { getGameHandler } from "@/shared/Game";
import { Game } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function usePropose(gameId: string, token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playerIds: string[]) => {
      const res = await propose(gameId, token, playerIds);
      if (!res.ok) {
        toast.error(res.msg);
        console.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (playerIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ["game", gameId] });

      const previousGame = queryClient.getQueryData<Game>(["game", gameId]);

      if (!previousGame) {
        return { previousGame: null, newGame: null };
      }

      const gameHandler = getGameHandler(previousGame);

      try {
        gameHandler.propose(playerIds);

        queryClient.setQueryData(["game", gameId], gameHandler.game);

        return { previousGame, newGame: gameHandler.game };
      } catch {
        return { previousGame, newGame: null };
      }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _newCharacter, context) => {
      queryClient.setQueryData(["game", gameId], context?.previousGame);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}

export default usePropose;
