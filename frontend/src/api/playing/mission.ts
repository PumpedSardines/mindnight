import { API_URL } from "@/const";
import { ApiRes } from "@/types";

async function mission(gameId: string, token: string, hack: boolean) {
  return await fetch(`${API_URL}/game/${gameId}/playing/mission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ hack }),
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<null>);
}

export default mission;
