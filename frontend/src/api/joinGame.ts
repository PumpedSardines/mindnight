import { API_URL } from "@/const";
import { Game } from "@/shared/types";
import { ApiRes } from "@/types";

async function joinGame(
  gameId: string,
  name: string,
  adminToken: string | null,
) {
  return await fetch(`${API_URL}/game/${gameId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      adminToken,
    }),
  })
    .then((v) => v.json())
    .then(
      (v) =>
        v as ApiRes<{
          playerId: string;
          token: string;
          gameId: string;
          game: Game;
        }>,
    );
}

export default joinGame;
