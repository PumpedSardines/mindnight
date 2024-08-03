import { API_URL } from "@/const";
import { Character } from "@/shared/types";
import { ApiRes } from "@/types";

async function updateCharacter(
  gameId: string,
  character: Character,
  token: string,
) {
  return await fetch(`${API_URL}/game/${gameId}/character`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      character,
    }),
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<null>);
}

export default updateCharacter;
