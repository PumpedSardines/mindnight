import { API_URL } from "@/const";
import { ApiRes } from "@/types";

async function kickPlayer(gameId: string, playerId: string, token: string) {
  return await fetch(`${API_URL}/game/${gameId}/player/${playerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<null>);
}

export default kickPlayer;