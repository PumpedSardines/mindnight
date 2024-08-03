import { getGameHandler } from "@/shared/Game";
import * as db from "@/db";
import { sanitizeGame } from "@/utils/sanitize";
import { Game, Player } from "@/shared/types";

function getGameHandlerFromId(id: string):
  | (ReturnType<typeof getGameHandler> & {
      save: () => void;
      getSanitizedGame(player: Player): Game;
    })
  | null {
  const rawGame = db.getGame(id);

  if (!rawGame) {
    return null;
  }

  const handler = getGameHandler(rawGame);

  return {
    ...handler,
    getSanitizedGame(player: Player) {
      return sanitizeGame(player)(handler.game);
    },
    save() {
      db.setGame(id, handler.game);
    },
  };
}

export default getGameHandlerFromId;
