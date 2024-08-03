import { API_URL } from "@/const";
import { ApiRes } from "@/types";

async function createGame() {
  return await fetch(`${API_URL}/game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((v) => v.json())
    .then((v) => v as ApiRes<{ gameId: string; adminToken: string }>);
}

export default createGame;
