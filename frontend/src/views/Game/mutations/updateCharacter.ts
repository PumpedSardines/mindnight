import updateCharacter from "@/api/updateCharacter";
import { Character, Game } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useUpdateCharacter(gameId: string, playerId: string, token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: Character) => {
      const res = await updateCharacter(gameId, character, token);
      if (!res.ok) {
        toast.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (newCharacter) => {
      await queryClient.cancelQueries({ queryKey: ["game", gameId] });

      const previousGame = queryClient.getQueryData<Game>(["game", gameId]);

      if (!previousGame) {
        return { previousGame: null, newGame: null };
      }

      const newGame = {
        ...previousGame,
        players: previousGame.players.map((player) =>
          player.id === playerId
            ? { ...player, character: newCharacter }
            : player,
        ),
      };

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

export default useUpdateCharacter;
