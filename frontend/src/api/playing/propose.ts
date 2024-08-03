import { API_URL } from "@/const";
import { ApiRes } from "@/types";

async function propose(gameId: string, token: string, playerIds: string[]) {
  return await fetch(`${API_URL}/game/${gameId}/playing/propose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ playersIds: playerIds }),
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<null>);
}

export default propose;
