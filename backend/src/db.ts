import { Game } from "@/shared/types";

const database = new Map<string, Game>();

export function getGame(id: string): Game | null {
  return JSON.parse(JSON.stringify(database.get(id) ?? null));
}

export function setGame(id: string, game: Game) {
  database.set(id, JSON.parse(JSON.stringify(game)));
}
