import { API_URL } from "@/const";
import { ApiRes } from "@/types";

async function proposeVote(gameId: string, token: string, accept: boolean) {
  return await fetch(`${API_URL}/game/${gameId}/playing/propose-vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ accept }),
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<null>);
}

export default proposeVote;
