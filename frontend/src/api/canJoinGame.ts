import { API_URL } from "@/const";
import { ApiRes } from "@/types";

async function canJoinGame(gameId: string) {
  return await fetch(`${API_URL}/game/${gameId}/can-join`)
    .then((v) => v.json())
    .then((v) => v as ApiRes<{ canJoin: boolean }>);
}

export default canJoinGame;
