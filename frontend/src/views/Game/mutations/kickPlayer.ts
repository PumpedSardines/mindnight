import kickPlayer from "@/api/kickPlayer";
import { Game } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useKickPlayer(gameId: string, token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playerId: string) => {
      const res = await kickPlayer(gameId, playerId, token);
      if (!res.ok) {
        toast.error(res.msg);
        console.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (playerId: string) => {
      await queryClient.cancelQueries({ queryKey: ["game", gameId] });

      const previousGame = queryClient.getQueryData<Game>(["game", gameId]);

      if (!previousGame) {
        return { previousGame: null, newGame: null };
      }

      const newGame = {
        ...previousGame,
        players: previousGame.players.filter((p) => p.id !== playerId),
      };

      console.log(previousGame, newGame);

      queryClient.setQueryData(["game", gameId], newGame);

      return { previousGame, newGame };
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

export default useKickPlayer;
