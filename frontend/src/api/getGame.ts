import { API_URL } from "@/const";
import { Game } from "@/shared/types";
import { ApiRes } from "@/types";

async function getGame(gameId: string, token: string) {
  return await fetch(`${API_URL}/game/${gameId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<Game>);
}

export default getGame;
